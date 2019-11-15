import { escapeId } from 'mysql';

import { Client } from './client';
import { Table } from './table';
import { ITablesRes } from '../interfaces';

export class Database {
  protected _tables = new Map<string, Table>();

  constructor(public name: string, protected _client: Client) {
    this.name = escapeId(name);
  }

  public query<T>(sql: string) {
    return this._client.query<T>(sql);
  }

  public async tables() {
    const res = await this.query<ITablesRes>('show tables');

    return res.map(r => Object.values(r)[0]);
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
