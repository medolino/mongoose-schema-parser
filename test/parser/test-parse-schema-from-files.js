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

  const expectedSchema = {
    exampleSchema: {
      schema: {
        name: {
          type: 'String'
        }
      }
    }
  }

  t.deepEqual(schema, expectedSchema)
})
