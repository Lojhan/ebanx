import { describe, it, expect } from "bun:test";

type Expected = {
  status: number;
  body: any;
};

const baseUrl = "http://localhost:3000";
const buildURL = (path: string) => `${baseUrl}/${path}`;

function confirmResponse(response: Expected, expected: Expected) {
  expect(response.status).toBe(expected.status);
  if ([400, 404].includes(response.status)) return;
  if (expected.body === null) return expect(response.body).toBeNull();
  expect(response.body).toEqual(expected.body);
}

type FetchParser = "json" | "text" | "blob" | "arrayBuffer";
async function post(path: string, body: any, parser: FetchParser = "json") {
  const response = await fetch(buildURL(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await response[parser]();
  return { status: response.status, body: json };
}

describe("E2E", () => {
  describe("Reset state before starting tests", () => {
    it("POST /reset", async () => {
      const expectedResponse: Expected = { status: 200, body: "OK" };
      const response = await post("reset", {}, "text");
      confirmResponse(response, expectedResponse);
    });
  });

  describe("Get balance for non-existing account", () => {
    it("GET /balance?account_id=1234", async () => {
      const expectedResponse: Expected = { status: 404, body: null };
      const response = await fetch(buildURL("balance?account_id=1234"));
      confirmResponse(response, expectedResponse);
    });
  });

  describe("Create account with initial balance", () => {
    it('POST /event {"type":"deposit", "destination":"100", "amount":10}', async () => {
      const expectedResponse: Expected = {
        status: 201,
        body: { destination: { id: "100", balance: 10 } },
      };

      const response = await post("event", {
        type: "deposit",
        destination: "100",
        amount: 10,
      });

      confirmResponse(response, expectedResponse);
    });
  });

  describe("Deposit into existing account", () => {
    it('POST /event {"type":"deposit", "destination":"100", "amount":10}', async () => {
      const expectedResponse: Expected = {
        status: 201,
        body: { destination: { id: "100", balance: 20 } },
      };

      const response = await post("event", {
        type: "deposit",
        destination: "100",
        amount: 10,
      });

      confirmResponse(response, expectedResponse);
    });
  });

  describe("Get balance for existing account", () => {
    it("GET /balance?account_id=100", async () => {
      const expectedResponse: Expected = { status: 200, body: 20 };
      const response = await fetch(buildURL("balance?account_id=100"));
      confirmResponse(
        {
          status: response.status,
          body: await response.json(),
        },
        expectedResponse
      );
    });
  });

  describe("Withdraw from non-existing account", () => {
    it('POST /event {"type":"withdraw", "origin":"200", "amount":10}', async () => {
      const expectedResponse: Expected = { status: 404, body: undefined };
      const response = await post("event", {
        type: "withdraw",
        origin: "200",
        amount: 10,
      });

      confirmResponse(response, expectedResponse);
    });
  });

  describe("Withdraw from existing account", () => {
    it('POST /event {"type":"withdraw", "origin":"100", "amount":5}', async () => {
      const expectedResponse: Expected = {
        status: 201,
        body: { origin: { id: "100", balance: 15 } },
      };

      const response = await post("event", {
        type: "withdraw",
        origin: "100",
        amount: 5,
      });

      confirmResponse(response, expectedResponse);
    });
  });

  describe("Transfer from existing account", () => {
    it('POST /event {"type":"transfer", "origin":"100", "amount":15, "destination":"300"}', async () => {
      const expectedResponse: Expected = {
        status: 201,
        body: {
          origin: { id: "100", balance: 0 },
          destination: { id: "300", balance: 15 },
        },
      };

      const response = await post("event", {
        type: "transfer",
        origin: "100",
        amount: 15,
        destination: "300",
      });

      confirmResponse(response, expectedResponse);
    });
  });

  describe("Transfer from non-existing account", () => {
    it('POST /event {"type":"transfer", "origin":"200", "amount":15, "destination":"300"}', async () => {
      const expectedResponse: Expected = { status: 404, body: undefined };

      const response = await post("event", {
        type: "transfer",
        origin: "200",
        amount: 15,
        destination: "300",
      });

      confirmResponse(response, expectedResponse);
    });
  });
});
