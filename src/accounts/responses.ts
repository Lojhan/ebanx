import { Account } from "./Account";

export type NotFoundResponse = {
  status: 404;
};

export type BalanceResponse = {
  status: 200;
  body: number;
};

export type DepositResponse = {
  status: 201;
  body: {
    destination: Account;
  };
};

export type WithdrawResponse = {
  status: 201;
  body: {
    origin: Account;
  };
};

export type TransferResponse = {
  status: 201;
  body: {
    origin: Account;
    destination: Account;
  };
};

export type EventResponse =
  | DepositResponse
  | WithdrawResponse
  | TransferResponse;

export type ResetResponse = void;
