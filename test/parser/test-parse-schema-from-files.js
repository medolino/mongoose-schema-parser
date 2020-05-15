const test = require('ava')
const { resolve } = require('path')

const parserHelper = require(resolve('./'))

test.serial('throw error if no mongoose instance found', t => {
  const filePaths = ['test/test-files/no-mongoose-example.js']

  const error = t.throws(() => {
    parserHelper.parseSchemaFromFiles(filePaths)
  }, { instanceOf: Error })

  t.is(error.message, 'Mongoose instance cannot be found')
})

test.serial('parse schema from array of file paths', t => {
  const filePaths = ['test/test-files/example-01.js']

  const schema = parserHelper.parseSchemaFromFiles(filePaths)

  const expectedResponse = {
    schema: {
      exampleSchema: {
        schema: {
          _id: {
            type: 'ObjectId'
          },
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
          _id: {
            type: 'ObjectId'
          },
          name: {
            type: 'String'
          }
        }
      }
    },
    errors: ['Failed to require: test/test-files/example-require-error.js']
  }

  t.deepEqual(schema, expectedResponse)
})
