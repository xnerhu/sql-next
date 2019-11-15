export interface IQuerySelector<T> {
  $or?: Array<IQueryFilter<T>>;
}

export type IQueryFilter<T> = {
  [P in keyof T]?: Partial<T[P]> | RegExp;
} & IQuerySelector<T>;

export interface IQueryOptions {
  limit?: number;
  offset?: number;
}

export interface IOperationRes {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
}

export type ITablesRes = {
  [key: string]: string;
}[];
