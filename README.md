# sql-next

[![Travis](https://img.shields.io/travis/xnerhu/sql-next.svg?style=flat-square)](https://travis-ci.org/xnerhu/sql-next.svg)
[![NPM](https://img.shields.io/npm/v/sql-next.svg?style=flat-square)](https://www.npmjs.com/package/sql-next)
[![NPM](https://img.shields.io/npm/dm/sql-next?style=flat-square)](https://www.npmjs.com/package/sql-next)
[![Discord](https://discordapp.com/api/guilds/307605794680209409/widget.png?style=shield)](https://discord.gg/P7Vn4VX)
[![Github](https://img.shields.io/github/followers/xnerhu.svg?style=social&label=Follow)](https://github.com/xnerhu)

</div>

SQL-next is a wrapper around [node-mysql](https://github.com/mysqljs/mysql) with __MongoDb like queries__ and promise-based api.

<a href="https://www.patreon.com/bePatron?u=21429620">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

### Features
- JSON based queries
- Selectors _(not yet done)_
- Promise based api

## Installing

```bash
$ npm install sql-next
```

## Quick start

An example of finding items with a filter:

```js
import { Client, IConnectionConfig } from 'sql-next';

const config: IConnectionConfig = {
  host: 'example.com',
  user: 'username',
  password: '123',
  port: 8080,
};

interface Item {
  _id: number;
  title: string;
  body: string;
}

async function init() {
  const client = new Client();

  await client.connect(config);
  
  console.log('Connected!');

  const db = client.db('name');
  const table = db.table<Item>('tests');

  const items = await table.find({
    title: 'sql-next',
    $or: [
      {content: 'test'},
      {content: 'lorem ipsum'},
    ],
  }, {
    limit: 10,
    offset: 2,
  });

  console.log(items);
}

init();
```

## API

Class `Client`:

__TODO__
