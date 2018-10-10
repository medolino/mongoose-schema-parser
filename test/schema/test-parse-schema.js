import test from 'ava'

const mongoose = require('mongoose')
const path = require('path')

const schemaHelper = require(path.resolve('./lib/schema'))

const Schema = mongoose.Schema

test('parse basic schema', t => {
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
      type: Array
    },
    arrayEmpty: [],
    arrayOfStrings: [String],
    arrayOfNumbers: [Number]
  })

  const parsedSchema = schemaHelper.parseSchema(SampleSchema)

  const expectedSchema = {
    string: { type: 'String' },
    number: { type: 'Number' },
    decimal: { type: 'Decimal128' },
    boolean: { type: 'Boolean' },
    mixed: { type: 'Mixed' },
    objectId: { type: 'ObjectId' },
    date: { type: 'Date' },
    buffer: { type: 'Buffer' },
    map: { type: 'Map' },
    arrayWithType: { type: 'Array' },
    arrayEmpty: { type: 'Array' },
    arrayOfStrings: { type: 'ArrayOfString' },
    arrayOfNumbers: { type: 'ArrayOfNumber' }
  }

  t.deepEqual(parsedSchema, expectedSchema, 'parsedSchema does not match expectedSchema')
})

test('parse schema with nested Object', t => {
  const SampleSchema = new Schema({
    nestedObject: {
      nestedString: {
        type: String
      },
      nestedNumber: {
        type: Number
      }
    }
  })

  const parsedSchema = schemaHelper.parseSchema(SampleSchema)

  const expectedSchema = {
    nestedObject: {
      type: 'Object',
      schema: {
        nestedString: { type: 'String' },
        nestedNumber: { type: 'Number' }
      }
    }
  }

  t.deepEqual(parsedSchema, expectedSchema, 'parsedSchema does not match expectedSchema')
})

test('parse schema with nested SubSchema', t => {
  const childSchema = new Schema({
    childString: 'string'
  })

  const MainSchema = new Schema({
    nestedSchema: childSchema
  })

  const parsedSchema = schemaHelper.parseSchema(MainSchema)

  const expectedSchema = {
    nestedSchema: {
      type: 'Schema',
      schema: {
        childString: { type: 'String' }
      }
    }
  }

  t.deepEqual(parsedSchema, expectedSchema, 'parsedSchema does not match expectedSchema')
})

test('parse schema with nested SubSchema defined as type', t => {
  // NOTE:
  // this test handles the case when you define subschema as type,
  // because mongoose doesn't build schema like schema.obj but schema.type.obj
  const childSchema = new Schema({
    childString: 'string'
  })

  const MainSchema = new Schema({
    nestedSchema: {
      type: childSchema
    }
  })

  const parsedSchema = schemaHelper.parseSchema(MainSchema)

  const expectedSchema = {
    nestedSchema: {
      type: 'Schema',
      schema: {
        childString: { type: 'String' }
      }
    }
  }

  t.deepEqual(parsedSchema, expectedSchema, 'parsedSchema does not match expectedSchema')
})

test('parse schema with nested array of SubSchemas', t => {
  const childSchema = new Schema({
    childString: 'string'
  })

  const MainSchema = new Schema({
    nestedSchemas: [childSchema]
  })

  const parsedSchema = schemaHelper.parseSchema(MainSchema)

  const expectedSchema = {
    nestedSchemas: {
      type: 'ArrayOfSchema',
      schema: {
        childString: { type: 'String' }
      }
    }
  }

  t.deepEqual(parsedSchema, expectedSchema, 'parsedSchema does not match expectedSchema')
})

test('parse schema with nested array of SubSchemas defined as type', t => {
  // NOTE:
  // see note inside "parse schema with nested SubSchema defined as type" test
  const childSchema = new Schema({
    childString: 'string'
  })

  const MainSchema = new Schema({
    nestedSchemas: {
      type: [childSchema]
    }
  })

  const parsedSchema = schemaHelper.parseSchema(MainSchema)

  const expectedSchema = {
    nestedSchemas: {
      type: 'ArrayOfSchema',
      schema: {
        childString: { type: 'String' }
      }
    }
  }

  t.deepEqual(parsedSchema, expectedSchema, 'parsedSchema does not match expectedSchema')
})
