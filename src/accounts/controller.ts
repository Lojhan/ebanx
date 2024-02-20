import {
  type EventPayload,
  Event,
  type DepositEvent,
  type WithdrawEvent,
  type TransferEvent,
} from "./Event";
import type {
  BalanceResponse,
  DepositResponse,
  EventResponse,
  NotFoundResponse,
  TransferResponse,
  WithdrawResponse,
} from "./responses";
import type { AccountsService } from "./service";

const notFound = { status: 404 } as const;

export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  public async getBalance(
    id: string
  ): Promise<BalanceResponse | NotFoundResponse> {
    const account = this.accountsService.getAccount(id);
    if (!account) return Promise.resolve(notFound);
    return Promise.resolve({ status: 200, body: account.balance });
  }

  public async handleEvent(
    event: DepositEvent
  ): Promise<DepositResponse | NotFoundResponse>;
  public async handleEvent(
    event: WithdrawEvent
  ): Promise<WithdrawResponse | NotFoundResponse>;
  public async handleEvent(
    event: TransferEvent
  ): Promise<TransferResponse | NotFoundResponse>;
  public async handleEvent(
    event: EventPayload
  ): Promise<EventResponse | NotFoundResponse> {

    if (event.type === Event.DEPOSIT) {
      const { destination, amount } = event;
      const account = this.accountsService.deposit(destination, amount);
      return Promise.resolve({ status: 201, body: { destination: account } });
    }

    if (event.type === Event.WITHDRAW) {
      const { origin, amount } = event;
      const account = this.accountsService.withdraw(origin, amount);
      if (!account) return Promise.resolve(notFound);
      return Promise.resolve({ status: 201, body: { origin: account } });
    }

    if (event.type === Event.TRANSFER) {
      const { origin, destination, amount } = event;
      const result = this.accountsService.transfer(origin, destination, amount);
      if (!result) return Promise.resolve(notFound);
      return Promise.resolve({ status: 201, body: result });
    }

    return Promise.resolve(notFound);
  }

  public reset() {
    this.accountsService.reset();
    this.accountsService.createAccount("300");
    return Promise.resolve({ status: 200 });
  }
}
