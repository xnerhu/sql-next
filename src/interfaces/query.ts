export interface IQuerySelector<T> {
  $or?: IQueryFilter<T>[];
}

export type IQueryFilter<T> = {
  [P in keyof T]?: Partial<T[P]> | RegExp;
} & IQuerySelector<T>;

export type ISortQuery<T> = {
  [P in keyof T]?: boolean;
}

export interface IQueryOptions<T> {
  limit?: number;
  offset?: number;
  sort?: ISortQuery<T>;
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

export type IUpdateItem<T> = Partial<T>;
