export interface IQuerySelector<T> {
  $or?: IQueryFilter<T>[];
}

export type IQueryFilter<T> = {
  [P in keyof T]?: Partial<T[P]> | IQueryCondition<T[P]>;
} & IQuerySelector<T>;

export type IQueryCondition<T> = (T extends string ? IQueryFilterItem : never);

export interface IQueryFilterItem {
  $text?: string;
}

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
