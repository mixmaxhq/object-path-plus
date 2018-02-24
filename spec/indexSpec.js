const { describe } = require('ava-spec');

const { resolve, validate, set } = require('..');


describe('resolve', (it) => {
  it('should resolve regular object-paths', (t) => {
    t.is(resolve({ a: { b: 1 } }, 'a.b'), 1);
  });

  it('should resolve concatenated object-paths for numbers', (t) => {
    t.is(resolve({ a: { b: 1 }, c: { d: 2 } }, 'a.b + c.d'), 3);
  });

  it('should resolve concatenated object-paths for strings', (t) => {
    t.is(resolve({ a: { b: 'foo' }, c: { d: 'bar' } }, 'a.b + c.d'), 'foobar');
  });

  it('should resolve concatenated object-paths and respect literals', (t) => {
    t.is(resolve({ a: { b: 1 }, c: { d: 2 } }, 'a.b + " - " + c.d'), '1 - 2');
    t.is(resolve({ a: { b: 1 }, c: { d: 2 } }, 'a.b + \' - \' + c.d'), '1 - 2');

    t.is(resolve({ a: { b: 1 }, c: { d: 2 } }, 'a.b + \' "-" \' + c.d'), '1 "-" 2');
    t.is(resolve({ a: { b: 'Foo' }, c: { d: 'bar' } }, 'a.b + "\'s " + c.d'), 'Foo\'s bar');
  });

  it('should resolve concatenated object-paths and respect literals', (t) => {
    t.is(resolve({ a: { b: 'foo' }, c: { d: 'bar' } }, 'a.b + " " + c.d'), 'foo bar');
  });

  it('should resolve concatenated object-paths and respect literals (2+)', (t) => {
    t.is(resolve({
      a: { b: 'foo' },
      c: { d: 'bar' },
      e: { f: ['baz', 'whiz'] }
    }, 'a.b + " " + c.d + " " + e.f.1'), 'foo bar whiz');

    t.is(resolve({
      a: { b: 'foo' },
      c: { d: 'bar' },
      e: { f: [0, 1] }
    }, 'a.b + " " + c.d + " " + e.f.1'), 'foo bar 1');
  });

  it('should resolve concatenated object-paths and respect literals (unicode)', (t) => {
    t.is(resolve({
      a: { b: 'foo' },
      '15\u00f8C': { '3\u0111': 'bar' }
    }, 'a.b + " " + 15\u00f8C.3\u0111'), 'foo bar');
  });

  it('should resolve dynamic array index lookups', (t) => {
    t.is(resolve({
      firstkey: {index: 1},
      arr: [{key: 1}, {key: 2}]
    }, 'arr[firstkey.index].key'), 2);
  });

  it('should ignore brackets in a string', (t) => {
    t.is(resolve({}, '"[not an array]"'), '[not an array]');
  });
});

describe('validate', (it) => {
  it('should validate regular object-paths', (t) => {
    t.true(validate('a.b'));
  });

  it('should validate concatenated object-paths', (t) => {
    t.true(validate('a.b + c.d'));
  });

  it('should validate concatenated object-paths with string literals', (t) => {
    t.true(validate('a.b + " " + c.d'));
    t.true(validate('a.b + \' \' + c.d'));
    t.true(validate('a.b + \' \' + c.d + c.1.2'));
    t.true(validate('a.b + \'"\''));
  });

  it('should return false on invalid object-paths', (t) => {
    t.false(validate('a.b + hello world'));
    t.false(validate('a.b + hello + \''));
    t.false(validate('a.b + hello +'));
  });

  it('should validate dynamic array lookups', (t) => {
    t.true(validate('a[1].another'));
  });
});

describe('set', (it) => {
  it('should set a key', (t) => {
    const obj = {};

    set(obj, 'a.b.0', 'value');

    t.deepEqual(obj, {a: {b: ['value']}});
  });

  it('should set a key', (t) => {
    const obj = {};

    set(obj, 'a.b.0', 'value');

    t.deepEqual(obj, {a: {b: ['value']}});
  });
});
