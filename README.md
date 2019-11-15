# SQL-next

[![Travis](https://img.shields.io/travis/xnerhu/sql-next.svg?style=flat-square)](https://travis-ci.org/xnerhu/sql-next.svg)
[![NPM](https://img.shields.io/npm/v/sql-next.svg?style=flat-square)](https://www.npmjs.com/package/sql-next)
[![NPM](https://img.shields.io/npm/dm/sql-next?style=flat-square)](https://www.npmjs.com/package/sql-next)
[![Discord](https://discordapp.com/api/guilds/307605794680209409/widget.png?style=shield)](https://discord.gg/P7Vn4VX)
[![Github](https://img.shields.io/github/followers/xnerhu.svg?style=social&label=Follow)](https://github.com/xnerhu)

</div>

SQL-next is a wrapper around [node-mysql](https://github.com/mysqljs/mysql), which provides MongoDB like queries and promise-based api.

<a href="https://www.patreon.com/bePatron?u=21429620">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

### Features

- JSON queries
- Selectors _(not yet done)_
- Promise based api

Checkout [roadmap](https://github.com/xnerhu/sql-next/projects/1) to see what's coming.

## Installing

```bash
$ npm install sql-next
```

## Quick start

An example of finding an item:

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
  header: string;
  body: string;
}

async function init() {
  const client = new Client();

  await client.connect(config);

  console.log('Connected!');

  const db = client.db('name');
  const table = db.table < Item > 'tests';

  const item = await table.findOne({ _id: 2 });

  console.log(item);
}

init();
```

Output:

```js
{
  _id: 2,
  header: 'Hello world!',
  body: 'Lorem ipsum...',
}
```

## API

Class `Client`:

- [`Client.connect`](#clientConnect)
- [`Client.close`](#clientClose)
- [`Client.db`](#clientDb)
- [`Client.switchUser`](#clientSwitchUser)
- [`Client.query`](#clientQuery)

Class `Database`:

- [`Database.tables`](#databaseTables)
- [`Database.table`](#databaseTable)

Class `Table`:

- [`Table.find`](#tableFind)
- [`Table.findOne`](#tableFindOne)
- [`Table.count`](#tableCount)
- [`Table.insertOne`](#tableInsertOne)
- [`Table.insert`](#tableInsert)

### Class `Client`

#### Methods

<a name="clientConnect"></a>

- `Client.connect(config: string | IConnectionConfig): Promise<any[]>`
  <br />
  Connects to mysql server.
  <br />

  ```js
  import { Client } from 'sql-next';

  const client = new Client();

  try {
    await client.connect({
      host: 'example.com',
      user: 'username',
      password: '123',
      port: 8080,
    });

    console.log('Connected!');
  } catch (error) {
    console.log('Failed to connect!', error);
  }
  ```

<a name="clientClose"></a>

- `Client.close(): Promise<any[]>`
  <br />
  Closes connection.
  <br />

  ```js
  await client.close();

  console.log('Closed!');
  ```

<a name="clientDb"></a>

- `Client.db(name: string): Database`
  <br />
  Returns a new database instance that shares the same connection with `Client`.
  <br />

  ```js
  const client = new Client();
  const db = client.db('users');
  ```

<a name="clientSwitchUser"></a>

- `Client.switchUser(config: ConnectionOptions): Promise<void>`
  <br />
  Reconnects with new user credentials.
  <br />

  ```js
  const client = new Client();

  client.switchUser({
    user: 'seconduser',
    password: 'password',
  });
  ```

<a name="clientQuery"></a>

- `Client.query<T>(sql: string): Promise<T>`
  <br />
  Performs a raw query globally.
  <br />

  ```js
  const client = new Client();
  const news = await client.query('SELECT * from `test`.`news`');
  ```

### Class `Database`

#### Methods

<a name="databaseTables"></a>

- `Database.tables(): Promise<string[]>`
  <br />
  Returns a list of tables in a database.
  <br />

  ```js
  import { Client } from 'sql-next';

  const client = new Client();
  const db = client.db('test');
  const tables = await db.tables();

  console.log(tables); // ['users', 'news', ...]
  ```

<a name="databaseTable"></a>

- `Database.table<T>(name: string): Table<T>`
  <br />
  Returns a new table instance that shares the same connection with `Client`.
  <br />

  ```js
  import { Client } from 'sql-next';

  const client = new Client();
  const db = client.db('test');
  const table = db.table('news');

  const news = await table.find();

  console.log(news); // [{_id: 1, title: 'lorem ipsum'}, ...]
  ```

#### Properties

- `Database.name`

### Class `Table<T>`

#### Methods

<a name="tableFind"></a>

- `Table.find(filter?: IQueryFilter<T>, options?: IQueryOptions): Promise<T[]>`
  <br />
  Fetches multiple items from a table. You can also set an offset or a limit, by setting `options`. See **todo** for advanced filtering.
  <br />

  ```js
  const table = db.table('news');

  const news = await table.find({ _authorId: 2 }, { offset: 2, limit: 10 });
  ```

<a name="Table.findOne"></a>

- `Table.findOne(filter?: IQueryFilter<T>): Promise<T[]>`
  <br />
  Returns a single item from a table. See **todo** for advanced filtering.
  <br />

  ```js
  const table = db.table('news');

  const item = await table.findOne({ _id: 11 });
  ```

<a name="Table.count"></a>

- `Table.count(filter?: IQueryFilter<T>): Promise<number>`
  <br />
  Counts items in a table.
  <br />

  ```js
  const table = db.table('news');

  const count = await table.count();

  console.log(count); // 141
  ```

<a name="Table.insert"></a>

- `Table.insert(items: T[]): Promise<T[]>`
  <br />
  Inserts multiple items to a table and returns each of them with replaced `_id` property.
  <br />

  ```js
  const table = db.table('news');

  const [first, second] = await table.insert([
    { title: 'Hello world!' },
    { title: 'Lorem ipsum' },
  ]);

  console.log(first._id, second._id); // 1, 2
  ```

<a name="Table.insertOne"></a>

- `Table.insertOne(items: T): Promise<T>`
  <br />
  Inserts a single item with replaced `_id` property, coresponding to added record.
  <br />

  ```js
  const table = db.table('news');

  const data = await table.insertOne({ title: 'Cooking tips' });

  console.log(data); // { _id: 3, title: 'Cooking tips' }
  ```

#### Properties

- `Table.name`
