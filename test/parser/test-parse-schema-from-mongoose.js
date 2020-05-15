const test = require('ava')
const mongoose = require('mongoose')
const { resolve } = require('path')

const schemaHelper = require(resolve('./'))

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
        _id: { type: 'ObjectId' },
        name: { type: 'String' }
      }
    },
    secondModel: {
      schema: {
        _id: { type: 'ObjectId' },
        name: { type: 'String' }
      }
    }
  }

  t.deepEqual(exportedSchema, expectedSchema, 'exportedSchema does not match expectedSchema')
})

test('throw error while parsing schemas when method parameter is not mongooseInstance', t => {
  const error = t.throws(() => {
    schemaHelper.parseSchemaFromMongoose('notMongooseInstance')
  }, { instanceOf: TypeError })

  t.is(error.message, 'mongooseInstance should be an instance of mongoose')
})
