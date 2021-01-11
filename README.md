# Instant.db

Instant.db is used to create database using json files.

## Quick Example

```js
const { Database } = require('instant.db');

const db = new Database('./some_file.json'); // If file name not provided, this will use database.json as file

db.set('foo', 'bar'); // Sets value for the key
db.get('foo'); // Returns bar
db.exists('foo'); // Returns if the id is entried, returns true
db.typeof('foo'); // Returns string. The typeof data!

db.all(); // Returns [{ ID: 'foo', data: 'bar' }]
db.raw(); // Returns raw data { foo: 'bar' }
db.random(); // Returns a random dataset!
db.random(4); // Returns array of 4 random datasets!

db.keys; // Getter which returns the array of id's ['foo']
db.values; // Getter which returns the array of data's ['bar']
db.cache; // Returns the map key value!
db.entries; // Returns the number of entries!

db.set('foo', ['foo']);
db.push('foo', 'bar', 'baz'); // -> ['foo', 'bar', 'baz'];
db.pull('foo', 'foo', 'bar'); // -> ['baz']

db.set('foo', 0);
db.math('foo', '+', 100); // -> 100
db.math('foo', '-', 100); // -> 0
db.math('foo', '*', 100); // -> 0
db.math('foo', '/', 100); // -> 0
db.math('foo', '**', 100); // -> 0
db.add('foo', 100); // -> 100
db.subtract('foo', 100); // -> 0

db.delete('foo'); // Will delete the foo value!
db.filter((data, id) => id == 'foo'); // Similar to Array.filter but will clear from the database too!
db.clear(); // Clears everything
```

## Typescript

Has typescript support too!

```ts
import Database from 'instant.db';

const db = new Database<string>();

db.set('foo', 'bar');
console.log(db.get('foo'));
```

## Support

**Discord Server:** [https://discord.gg/FrduEZd](https://discord.gg/FrduEZd)<br/>
**GitHub:** [https://github.com/Scientific-Guy/instant.db](https://github.com/Scientific-Guy/instant.db)

If any doubts, join our discord server and ask your doubts or just make an issues in our github repo!
