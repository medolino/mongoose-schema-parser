import test from 'ava'

const mongoose = require('mongoose')
const path = require('path')

const schemaHelper = require(path.resolve('./lib/schema'))

const Schema = mongoose.Schema

test('export database schemas from mongoose instance', t => {
  const FirstSchema = new Schema({ 
    name: 'string'
  })

  const SecondSchema = new Schema({ 
    name: 'string'
  })

  const firstModel = mongoose.model('firstModel', FirstSchema)
  const secondModel = mongoose.model('secondModel', SecondSchema)

  const exportedSchema = schemaHelper.exportDatabaseSchema(mongoose)

  const expectedSchema = {
    firstModel: {
      schema: {
        name: { type: 'String' }
      }
    },
    secondModel: {
      schema: {
        name: { type: 'String' }
      }
    }
  }

  t.deepEqual(exportedSchema, expectedSchema, 'exportedSchema does not match expectedSchema')
})

test('throw error while exporting schemas when method parameter is not mongooseInstance', t => {
  const error = t.throws(() => {
    schemaHelper.exportDatabaseSchema('notMongooseInstance');
  }, TypeError)

  t.is(error.message, 'mongooseInstance should be an instance of mongoose');
})
