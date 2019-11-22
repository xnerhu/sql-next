import { escape, escapeId } from 'mysql';

import { IQueryFilter, IQueryOptions, ISortQuery } from '../interfaces';

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

    return `${escapeId(r)} ${char} ${escape(value)}`
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

  return sql;
}

export const createOptionsQuery = (options: IQueryOptions<any>) => {
  if (!options) return '';

  let sql = '';
  const { limit, offset, sort } = options;

  if (sort) {
    sql += createSortQuery(sort) + ' ';
  }

  if (limit) {
    sql += `LIMIT ${escape(limit)} `;
  }

  if (offset) {
    sql += `OFFSET ${escape(offset)} `;
  }

  return sql;
}

export const createValuesQuery = (item: any) => {
  const keys = Object.keys(item);

  if (!keys.length) return '';

  let sql = 'SET ';

  for (let i = 0; i < keys.length; i++) {
    sql += `${escapeId(keys[i])} = ${escape(item[keys[i]])}`;

    if (i !== keys.length - 1) {
      sql += ', ';
    }
  }

  return sql;
}

export const createSortQuery = (options: ISortQuery<any>) => {
  let sql = 'ORDER BY ';
  let ascSql = '';

  const descKeys: string[] = [];
  const ascKeys: string[] = [];

  for (const key in options) {
    const escaped = escapeId(key);

    if (!options[key]) {
      descKeys.push(escaped);
    } else {
      ascKeys.push(escaped);
    }
  }

  if (!descKeys.length && !ascKeys.length) return '';

  if (descKeys.length) {
    sql += `${descKeys.join(', ')} DESC`;

    if (ascKeys.length) sql += ', ';
  }

  if (ascKeys.length) {
    ascSql += `${ascKeys.join(', ')} ASC`;
  }

  return sql + ascSql;
}
