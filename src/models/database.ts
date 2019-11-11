import { Client } from './client';
import { Table } from './table';

export class Database {
  protected _tables = new Map<string, Table>();

  constructor(public name: string, protected _client: Client) { };

  public async query<T>(sql: string) {
    await this._client.switchDb(this.name);
    return this._client.query<T>(sql);
  }

  public async tables() {
    const res = await this.query('show tables');
    return res.map((r: string) => Object.values(r)[0]);
  }

  public table<T>(name: string): Table<T> {
    let table = this._tables.get(name);

    if (!table) {
      table = new Table(name, this);
      this._tables.set(name, table);
    }

    return table;
  }
}
