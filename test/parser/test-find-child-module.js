import test from 'ava'

const path = require('path')

const { findChildModule } = require(path.resolve('./'))

test('find child module', t => {
  require(path.resolve('./test/test-files/example-01.js'))

  const testModule = module
  const mongoose = findChildModule(testModule, 'Mongoose')
  t.is(mongoose.constructor.name, 'Mongoose')
})

test('return undefined when module not found', t => {
  require(path.resolve('./test/test-files/example-01.js'))
  const testModule = module
  const moduleName = 'non-existing'

  const result = findChildModule(testModule, moduleName)
  t.is(result, undefined)
})

test('return undefined when module you are searching for is deeper than provided maxDepth', t => {
  require(path.resolve('./test/test-files/example-01.js'))

  const testModule = module
  const mongoose = findChildModule(testModule, 'Mongoose', 1)

  t.is(mongoose, undefined)
})
