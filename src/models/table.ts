import { IQueryFilter, IQueryOptions } from '../interfaces';
import { Database } from './database';
import { createFilterQuery, createOptionsQuery } from '../utils';

export class Table<T = any> {
  constructor(public name: string, protected _db: Database) { };

  public async find(filter?: IQueryFilter<T>, options?: IQueryOptions) {
    const sql = `SELECT * FROM ${this.name} ${createFilterQuery(filter)} ${createOptionsQuery(options)}`;

    return this._db.query<T>(sql);
  }

  public async findOne(filter?: IQueryFilter<T>) {
    const [res] = await this.find(filter, { limit: 1 });

    return res;
  }

  public async count(filter?: IQueryFilter<T>) {
    const sql = `SELECT COUNT(*) as count FROM ${this.name} ${createFilterQuery(filter)}`;
    const [{ count }] = await this._db.query<any>(sql);

    return count;
  }
}
