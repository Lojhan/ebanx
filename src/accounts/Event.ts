export enum Event {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

export type DepositEvent = {
  type: Event.DEPOSIT;
  destination: string;
  amount: number;
};

export type WithdrawEvent = {
  type: Event.WITHDRAW;
  origin: string;
  amount: number;
};

export type TransferEvent = {
  type: Event.TRANSFER;
  origin: string;
  destination: string;
  amount: number;
};

export type EventPayload = DepositEvent | WithdrawEvent | TransferEvent;