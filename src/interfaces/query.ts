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
