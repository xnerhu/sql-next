import { escape } from 'mysql';

import { IQueryFilter, IQueryOptions } from '../interfaces';

export const createFilterQuery = (filter: IQueryFilter<any>, _deep = false) => {
  if (!filter) return '';

  let sql = '';
  const keys = Object.keys(filter);
  const { $or } = filter;

  const andArgs = keys.filter(r => !r.startsWith('$')).map(r => {
    let value: any | RegExp = filter[r];
    let char = '=';

    if (value instanceof RegExp) {
      char = 'REGEXP';

      value = (value as any).toString().slice(1, -1);
    }

    return `${r} ${char} ${escape(value)}`
  });

  if (andArgs.length) {
    sql += `(${andArgs.join(' AND ')})`;
  }

  if (andArgs.length && $or) {
    sql += ' AND ';
  }

  if ($or) {
    const orSqls: string[] = [];

    $or.forEach(r => {
      orSqls.push(createFilterQuery(r, true));
    });

    sql += `(${orSqls.join(' OR ')})`;
  }

  if (!_deep && sql.length) {
    sql = `WHERE ${sql}`;
  }

  if (!_deep) console.log(sql);

  return sql;
}

export const createOptionsQuery = (options: IQueryOptions) => {
  if (!options) return '';

  let sql = '';
  const { limit, offset } = options;

  if (limit) {
    sql += `LIMIT ${escape(limit)} `;
  }

  if (offset) {
    sql += `OFFSET ${escape(offset)} `;
  }

  return sql;
}
