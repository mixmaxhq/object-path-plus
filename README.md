# object-path-plus

`object-path-plus` is an [object-path] compatible library that also
provides the ability to synthesize values from multiple provided paths.
Currently, it only supports the `.` delimited path format of `object-path`.

## Installation
```sh
yarn add object-path-plus
```

## Usage

## `object-path` usage

To see basic object path usage, see [object-path's documentation]


## Concatenating values

Concatenation with `object-path-plus` is very simple, just add a `+` sign!
You can concatenate resolve values from multiple `object-path`s and you can
also concatenate string literals with resolved path values.

```js
const { resolve } = require('object-path-plus');

resolve({ a: { b: 1 }, c: { d: 2 } }, 'a.b + c.d') === 3;

resolve({ a: { b: 'foo' }, c: { d: 'bar' } }, 'a.b + c.d') === 'foobar';

resolve({ a: { b: 1 }, c: { d: 2 } }, 'a.b + " - " + c.d') === '1 - 2';

resolve({ a: { b: 'foo' }, c: { d: 'bar' } }, 'a.b + " " + c.d') === 'foo bar';

resolve({
  a: { b: 'foo' },
  c: { d: 'bar' },
  e: { f: [ 'baz', 'whiz' ] }
}, 'a.b + " " + c.d + " " + e.f.1') === 'foo bar whiz';

resolve({
  a: { b: 'foo' },
  c: { d: 'bar' },
  e: { f: [ 0, 1 ] }
}, 'a.b + " " + c.d + " " + e.f.1') === 'foo bar 1';
```

## Validating object-path-plus paths

You can also test if a path is valid prior to trying to resolve a value with it.
```js
const { validate } = require('object-path-plus');

validate('a.b') === true;

validate('a.b + c.d') === true;

validate('a.b + hello world') === false;
```


## Changelog

* 1.0.1 Fix bad `package.json` entrypoint.
* 1.0.0 Initial release

[object-path's documentation]: https://github.com/mariocasciaro/object-path#usage
[object-path]: https://github.com/mariocasciaro/object-path
