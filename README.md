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

## Database actions

DatabaseAction is a class which is a fake database where you can execute your methods without affecting the main database itself and save it later whenever you want!

```js
const action = db.action();

action.set('foo', 'bar'); // You are setting the value foo as bar in the cache!
console.log(db.get('foo')); // Prints "null" as its still on cache

action.save(); // Now it saves the data from cache to the database
console.log(db.get('foo')); // Prints "bar"!

action.undo(); // Back to the state of database when th action was initiated!
console.log(db.get('foo')); // Returns "null"!
```

Unlike `Database` class, `DatabaseAction` has less methods!

```js
action.set('foo', 'bar'); // Sets value for the key
action.get('foo'); // Returns bar

action.all(); // Returns [{ ID: 'foo', data: 'bar' }]
action.raw(); // Returns raw data { foo: 'bar' }

action.keys; // Getter which returns the array of id's ['foo']
action.values; // Getter which returns the array of data's ['bar']
action.cache; // Returns the map key value!
action.entries; // Returns the number of entries!

action.set('foo', ['foo']);
action.push('foo', 'bar', 'baz'); // -> ['foo', 'bar', 'baz'];
action.pull('foo', 'foo', 'bar'); // -> ['baz']

action.set('foo', 0);
action.math('foo', '+', 100); // -> 100
action.math('foo', '-', 100); // -> 0
action.math('foo', '*', 100); // -> 0
action.math('foo', '/', 100); // -> 0
action.math('foo', '**', 100); // -> 0

action.delete('foo'); // Will delete the foo value!
action.filter((data, id) => id == 'foo'); // Similar to Array.filter but will clear from the database too!
```

## Documents

Documents are nothing but the same database but storing objects instead of just `key:value` type. For example view the following example:

### Database

How normal `Database` class stores!

```json
{ "foo": "bar" }
```

### Document

How normal `Document` class stores!

```json
[
    {
        "custom_field": "foo",
        "custom_field_2": "bar"
    }
]
```

Here is an example of using the `Document` class!

```js
const { Document } = require('instant.db');
const doc = new Document('./document.json');

doc.insert({
    custom_field: "foo",
    custom_field_2: "bar"
}) // Insert a new object to the db

doc.findOne({
    custom_field: "foo"
}) // Will return `{ custom_field: "foo", custom_field_2: "bar" }`
```

Document findOne uses a Object query or a callback here is an example below!

```js
doc.insert({ foo: 'bar' });

doc.findOne({ foo: 'bar', bar: 'baz' }); // Will return `{ foo: 'bar' }` even though `bar` field does not exists in it as it finds any object in the document which has the same value in the field!
doc.findOne(obj => obj.foo == 'bar'); // You can also use callbacks to use `findOne` which acts same as Array.prototype.find!
```

Methods of the `Document` class!

```js
doc.size // Returns the number of entries in the document!

doc.insert({ foo: 'bar' }); // Inserts object to the document
doc.raw(); // Returns the raw data of the file!
doc.getAll(); // Aliases for get raw method!

doc.findOne({ foo: 'bar', bar: 'baz' }); // Searches a dataset in the document with query or callback
doc.findMany({ foo: 'bar', bar: 'baz' }); // Returns an array of datasets in the document which maches the query or callback

doc.deleteOne({ foo: 'bar', bar: 'baz' }); // Searches a dataset in the document with query or callback and deletes it from the document!
doc.deleteMany({ foo: 'bar', bar: 'baz' }); // Searches all the datasets in the document which maches the query or callback and deletes it

doc.clear(); // Clears all the data in the document!
```

## Support

**Discord Server:** [https://discord.gg/FrduEZd](https://discord.gg/FrduEZd)
**GitHub:** [https://github.com/Scientific-Guy/instant.db](https://github.com/Scientific-Guy/instant.db)

If any doubts, join our discord server and ask your doubts or just make an issues in our github repo!