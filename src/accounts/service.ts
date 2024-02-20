import { type Database } from "../database";
import { Account } from "./Account";

export class AccountsService {
  constructor(private readonly database: Database) {}

  public getAccount(id: string): Account | null {
    const account = this.database.get<Account>(id);
    return account ?? null;
  }

  public createAccount(id: string): Account {
    this.database.set(id, { id, balance: 0 });
    return this.database.get<Account>(id);
  }

  public updateAccount(account: Account) {
    this.database.set(account.id, account);
  }

  public deposit(id: string, amount: number) {
    let account = this.getAccount(id);
    account ??= this.createAccount(id);
    account.balance += amount;
    this.updateAccount(account);
    return account;
  }

  public withdraw(id: string, amount: number) {
    let account = this.getAccount(id);
    if (!account) return null;
    account.balance -= amount;
    this.updateAccount(account);
    return account;
  }

  public transfer(origin: string, destination: string, amount: number) {
    let originAccount = this.getAccount(origin);
    let destinationAccount = this.getAccount(destination);
    if (!originAccount || !destinationAccount) return null;

    try {
      const copyOfOriginAccount = Object.assign({}, originAccount);
      const copyOfDestinationAccount = Object.assign({}, destinationAccount);
      copyOfOriginAccount.balance -= amount;
      copyOfDestinationAccount.balance += amount;
      this.updateAccount(copyOfOriginAccount);
      this.updateAccount(copyOfDestinationAccount);
      return {
        origin: copyOfOriginAccount,
        destination: copyOfDestinationAccount,
      };
    } catch (error) {
      this.updateAccount(originAccount);
      this.updateAccount(destinationAccount);
    }
  }

  public reset() {
    this.database.reset();
  }
}
