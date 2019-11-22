import { Connection, createConnection, ConnectionOptions } from 'mysql';

import { Database } from './database';
import { IConfig } from '../interfaces';

export class Client {
  protected _connection: Connection;

  protected _currentDb: string;

  public connect(config: string | IConfig): Promise<void> {
    this._connection = createConnection(config);

    return new Promise((resolve, reject) => {
      this._connection.connect(err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._connection.end(err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public db(name: string) {
    return new Database(name, this);
  }

  public switchUser(config: ConnectionOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      this._connection.changeUser(config, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public query<T>(sql: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this._connection.query(sql, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }
}
