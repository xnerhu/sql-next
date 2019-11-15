import { IQueryFilter, IQueryOptions, IOperationRes } from '../interfaces';
import { Database } from './database';
import { createFilterQuery, createOptionsQuery, createValuesQuery } from '../utils';

export class Table<T = any> {
  constructor(public name: string, protected _db: Database) { };

  public async find(filter?: IQueryFilter<T>, options?: IQueryOptions) {
    const sql = `SELECT * FROM ${this.name} ${createFilterQuery(filter)} ${createOptionsQuery(options)}`;

    return this._db.query<T[]>(sql);
  }

  public async findOne(filter?: IQueryFilter<T>) {
    const [res] = await this.find(filter, { limit: 1 });

    return res;
  }

  public async count(filter?: IQueryFilter<T>): Promise<number> {
    const sql = `SELECT COUNT(*) as count FROM ${this.name} ${createFilterQuery(filter)}`;
    const [{ count }] = await this._db.query(sql);

    return count;
  }

  public async insertOne(item: T) {
    const sql = `INSERT INTO ${this.name} ${createValuesQuery(item)}`;
    const { insertId } = await this._db.query<IOperationRes>(sql);

    return { ...item, _id: insertId };
  }
}
