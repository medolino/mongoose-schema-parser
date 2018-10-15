import test from 'ava'

const mongoose = require('mongoose')
const path = require('path')

const schemaHelper = require(path.resolve('./lib'))

const Schema = mongoose.Schema

test('parse schemas from mongoose instance', t => {
  const FirstSchema = new Schema({
    name: 'string'
  })

  const SecondSchema = new Schema({
    name: 'string'
  })

  mongoose.model('firstModel', FirstSchema)
  mongoose.model('secondModel', SecondSchema)

  const exportedSchema = schemaHelper.parseSchemaFromMongoose(mongoose)

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

test('throw error while parsing schemas when method parameter is not mongooseInstance', t => {
  const error = t.throws(() => {
    schemaHelper.parseSchemaFromMongoose('notMongooseInstance')
  }, TypeError)

  t.is(error.message, 'mongooseInstance should be an instance of mongoose')
})
