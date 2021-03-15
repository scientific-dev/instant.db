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