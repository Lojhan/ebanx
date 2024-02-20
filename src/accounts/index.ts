import { Database } from "../database";
import { AccountsService } from "./service";
import { AccountsController } from "./controller";

const database = Database.getInstance();
const accountsService = new AccountsService(database);
const accountsController = new AccountsController(accountsService);

export class AccountsModule {
  public static async init(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const noutFoundResponse = new Response("0", { status: 404 });
    const malformedRequestResponse = new Response("0", { status: 400 });
    if (path === "/balance") {
      if (request.method === "GET") {
        const id = url.searchParams.get("account_id");
        if (!id) return Promise.resolve(noutFoundResponse);
        const result = await accountsController.getBalance(id);
        if (result.status === 200)
          return new Response(result.body.toString(), {
            status: result.status,
          });
        return new Response("0", { status: result.status });
      }

      return Promise.resolve(noutFoundResponse);
    }

    if (path === "/event") {
      if (request.method === "POST") {
        const body = await request.json();
        if (!body) return Promise.resolve(malformedRequestResponse);
        const result = await accountsController.handleEvent(body);
        if (result.status === 201)
          return new Response(JSON.stringify(result.body), {
            status: result.status,
          });
        return new Response("0", { status: result.status });
      }

      return Promise.resolve(noutFoundResponse);
    }

    if (path === "/reset") {
      if (request.method === "POST") {
        const result = accountsController.reset();
        return new Response("OK", { status: 200 });
      }

      return Promise.resolve(noutFoundResponse);
    }

    return Promise.resolve(noutFoundResponse);
  }
}
