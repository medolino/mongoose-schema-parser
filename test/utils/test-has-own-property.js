const test = require('ava')
const { resolve } = require('path')

const { hasOwnProperty } = require(resolve('./lib/utils'))

test('should return true when provided property exists', t => {
  const demoObj = {
    testProp: 1
  }

  t.true(hasOwnProperty(demoObj, 'testProp'))
})

test('should return true when provided property exists, but is undefined', t => {
  const demoObj = {
    testProp: undefined
  }

  t.true(hasOwnProperty(demoObj, 'testProp'))
})

test('should not use hasOwnProperty defined on object, but Object.prototype.hasOwnProperty', t => {
  const demoObj = {
    testProp: 1,
    hasOwnProperty: () => false
  }

  t.true(hasOwnProperty(demoObj, 'testProp'))
})

test('should return false when provided property does not exist', t => {
  const demoObj = {
    testProp: 1
  }

  t.false(hasOwnProperty(demoObj, 'nonExisting'))
})
