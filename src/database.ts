/**
 *  This is a mocked database, it will act as a singleton and will be used to store the data.
 *
 *
 *
 */

export class Database {
    private static instance: Database;
    private data: Record<string, unknown>;

    private constructor() {
        this.data = {};
    }

    public static getInstance(): Database {
        Database.instance ??= new Database();
        return Database.instance;
    }

    public get<T>(key: string): T {
        return this.data[key] as T;
    }

    public set<T>(key: string, value: T): void {
        this.data[key] = value;
    }

    public reset(): void {
        this.data = {};
    }
}
