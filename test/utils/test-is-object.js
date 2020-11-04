const test = require('ava')
const { resolve } = require('path')

const { isObject } = require(resolve('./lib/utils'))

test('should return true for valid object', t => {
  t.true(isObject({}))
})

test('should return false for invalid object', t => {
  t.false(isObject('s'))
})

test('should return false for non-plain object (date)', t => {
  t.false(isObject(new Date()))
})

test('should return false for non-plain object (array)', t => {
  t.false(isObject(['1']))
})
