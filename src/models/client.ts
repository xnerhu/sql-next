import { Connection, createConnection, ConnectionOptions } from 'mysql';

import { Database } from './database';
import { IConfig } from '../interfaces';

export class Client {
  protected _connection: Connection;

  protected _currentDb: string;

  public connect(config: string | IConfig): Promise<any[]> {
    this._connection = createConnection(config);

    return new Promise((resolve, reject) => {
      this._connection.connect((err, ...args) => {
        if (err) reject(err);
        resolve(args);
      });
    });
  }

  public close(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._connection.end((err, args) => {
        if (err) reject(err);
        resolve(args);
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
