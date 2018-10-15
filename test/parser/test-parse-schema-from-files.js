import test from 'ava'

const mongoose = require('mongoose')
const path = require('path')

const parserHelper = require(path.resolve('./lib'))

test('parse schema from array of file paths', t => {
  const filePaths = [ 'test/test-files/example-01.model.js' ]

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

