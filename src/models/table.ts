import { escapeId } from 'mysql';

import { IQueryFilter, IQueryOptions, IOperationRes, IUpdateItem } from '../interfaces';
import { createFilterQuery, createOptionsQuery, createValuesQuery } from '../utils';
import { Database } from './database';

export class Table<T = any> {
  public fullName: string;

  constructor(public name: string, protected _db: Database) {
    this.name = escapeId(name);
    this.fullName = `${this._db.name}.${this.name}`;
  }

  public async find(filter?: IQueryFilter<T>, options?: IQueryOptions<T>) {
    const sql = `SELECT * FROM ${this.fullName} ${createFilterQuery(filter)} ${createOptionsQuery(options)}`;

    return this._db.query<T[]>(sql);
  }

  public async findOne(filter?: IQueryFilter<T>) {
    const [res] = await this.find(filter, { limit: 1 });

    return res;
  }

  public async count(filter?: IQueryFilter<T>): Promise<number> {
    const sql = `SELECT COUNT(*) as count FROM ${this.fullName} ${createFilterQuery(filter)}`;
    const [{ count }] = await this._db.query(sql);

    return count;
  }

  public async insert(items: T[]) {
    const promises = items.map(r => this.insertOne(r));

    return Promise.all(promises);
  }

  public async insertOne(item: T) {
    const sql = `INSERT INTO ${this.fullName} ${createValuesQuery(item)}`;
    const { insertId } = await this._db.query<IOperationRes>(sql);

    return { ...item, _id: insertId };
  }

  public update(filter: IQueryFilter<T>, update: IUpdateItem<T>) {
    const sql = `UPDATE ${this.fullName} ${createValuesQuery(update)} ${createFilterQuery(filter)}`;

    return this._db.query<IOperationRes>(sql);
  }
}
