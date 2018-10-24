import test from 'ava'

const path = require('path')

const parserHelper = require(path.resolve('./lib'))

test.serial('throw error if no mongoose instance found', t => {
  const filePaths = [ 'test/test-files/no-mongoose-example.js' ]

  const error = t.throws(() =>
    parserHelper.parseSchemaFromFiles(filePaths),
  Error
  )

  t.is(error.message, 'Mongoose instance cannot be found')
})

test.serial('parse schema from array of file paths', t => {
  const filePaths = [ 'test/test-files/example-01.js' ]

  const schema = parserHelper.parseSchemaFromFiles(filePaths)

  const expectedResponse = {
    schema: {
      exampleSchema: {
        schema: {
          name: {
            type: 'String'
          }
        }
      }
    },
    errors: []
  }

  t.deepEqual(schema, expectedResponse)
})

test.serial('return error if function cannot require provided file', t => {
  const filePaths = [
    'test/test-files/example-01.js',
    'test/test-files/example-require-error.js'
  ]

  const schema = parserHelper.parseSchemaFromFiles(filePaths)

  const expectedResponse = {
    schema: {
      exampleSchema: {
        schema: {
          name: {
            type: 'String'
          }
        }
      }
    },
    errors: [ 'test/test-files/example-require-error.js: Cannot find module \'nonExistingDependency\'' ]
  }

  t.deepEqual(schema, expectedResponse)
})
