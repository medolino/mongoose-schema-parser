import test from 'ava'

const path = require('path')

const { findChildModule } = require(path.resolve('./lib'))

test('find child module', async t => {
  require(path.resolve('./test/test-files/example-01.js'))
  // NOTE:
  // I am using module.children[2], because there is more dependencies
  // in this module that function can handle
  const testModule = module.children[2]
  const mongoose = findChildModule(testModule, 'Mongoose')

  t.is(mongoose.constructor.name, 'Mongoose')
})

test('throw error if module not found', async t => {
  require(path.resolve('./test/test-files/example-01.js'))
  const testModule = module.children[2]
  const moduleName = 'non-existing'

  const error = t.throws(() =>
    findChildModule(testModule, moduleName),
  Error
  )

  t.is(error.message, `Module ${moduleName} not found`)
})
