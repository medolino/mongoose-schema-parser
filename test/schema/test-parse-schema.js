import test from 'ava'

const mongoose = require('mongoose')
const path = require('path')

const schemaHelper = require(path.resolve('./lib/schema'))

const Schema = mongoose.Schema

test('parse specific schema', t => {
  const childSchema = new Schema({ 
    name: 'string'
  });

  const SampleSchema = new Schema({
    string: {
      type: String,
      maxlength: 10
    },
    number: {
      type: Number,
      required: 'Missing number value'
    },
    decimal: {
      type: Schema.Types.Decimal128
    },
    boolean: {
      type: Boolean,
      default: false
    },
    mixed: {
      type: Schema.Types.Mixed
    },
    objectId: {
      type: Schema.Types.ObjectId,
      ref: 'Country'
    },
    date: {
      type: Date
    },
    buffer: {
      type: Buffer
    },
    map: {
      type: Map
    },
    arrayWithType: { 
      type : Array
    },
    arrayEmpty: [],
    arrayOfStrings: [String],
    arrayOfNumbers: [Number],
    nestedObject: {
      nestedString: { 
        type: String
      }
    },
    nestedSchemaObject: childSchema,
    nestedSchemaObjects: [childSchema]
  })

  const parsedSchema = schemaHelper.parseSchema(SampleSchema)

  // console.log(JSON.stringify(parsedSchema, undefined, 2))
  console.dir(parsedSchema, {depth: null, colors: true})
})
