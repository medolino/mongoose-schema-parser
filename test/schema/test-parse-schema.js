import test from 'ava'

const mongoose = require('mongoose')
const path = require('path')

const schemaHelper = require(path.resolve('./lib/schema'))

const Schema = mongoose.Schema

test('parse basic schema', t => {
  const SampleSchema = new Schema({
    string: {
      type: String
      // maxlength: 10
    },
    number: {
      type: Number
      // required: 'Missing number value'
    },
    decimal: {
      type: Schema.Types.Decimal128
    },
    boolean: {
      type: Boolean
      // default: false
    },
    mixed: {
      type: Schema.Types.Mixed
    },
    objectId: {
      type: Schema.Types.ObjectId
      // ref: 'Country'
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
    _id: { type: 'ObjectId' },
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

test('parse schema with property type Object defined as empty object ({})', t => {
  const SampleSchema = new Schema({
    objProp: {}
  })

  const parsedSchema = schemaHelper.parseSchema(SampleSchema)

  const expectedSchema = {
    _id: { type: 'ObjectId' },
    objProp: { type: 'Object' }
  }

  t.deepEqual(parsedSchema, expectedSchema, 'parsedSchema does not match expectedSchema')
})

test('parse schema with nested Object defined as Schema', t => {
  const SampleSchema = new Schema({
    nestedObject: {
      nestedString: String,
      nestedNumber: {
        type: Number
      }
    }
  })

  const parsedSchema = schemaHelper.parseSchema(SampleSchema)

  const expectedSchema = {
    _id: { type: 'ObjectId' },
    nestedObject: {
      type: 'Schema',
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
    _id: { type: 'ObjectId' },
    nestedSchema: {
      type: 'Schema',
      schema: {
        _id: { type: 'ObjectId' },
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
    _id: { type: 'ObjectId' },
    nestedSchema: {
      type: 'Schema',
      schema: {
        _id: { type: 'ObjectId' },
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
    _id: { type: 'ObjectId' },
    nestedSchemas: {
      type: 'ArrayOfSchema',
      schema: {
        _id: { type: 'ObjectId' },
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
    _id: { type: 'ObjectId' },
    nestedSchemas: {
      type: 'ArrayOfSchema',
      schema: {
        _id: { type: 'ObjectId' },
        childString: { type: 'String' }
      }
    }
  }

  t.deepEqual(parsedSchema, expectedSchema, 'parsedSchema does not match expectedSchema')
})

test('parse schema with nested array of Objects defined as Schema', t => {
  const MainSchema = new Schema({
    nestedSchemas: [{
      childString: String,
      name: {
        type: String
      }
    }]
  })

  const parsedSchema = schemaHelper.parseSchema(MainSchema)

  const expectedSchema = {
    _id: { type: 'ObjectId' },
    nestedSchemas: {
      type: 'ArrayOfSchema',
      schema: {
        childString: { type: 'String' },
        name: { type: 'String' }
      }
    }
  }

  t.deepEqual(parsedSchema, expectedSchema, 'parsedSchema does not match expectedSchema')
})

test('parse schema with details', t => {
  const childSchema = new Schema({
    childName: {
      type: String,
      maxlength: 10
    }
  })

  const SampleSchema = new Schema({
    objectId: {
      type: Schema.Types.ObjectId,
      ref: 'RefSchema',
      required: true
    },
    boolean: {
      type: Boolean,
      default: false
    },
    child: childSchema
  })

  const parsedSchema = schemaHelper.parseSchema(SampleSchema)

  const expectedSchema = {
    _id: { type: 'ObjectId' },
    objectId: {
      type: 'ObjectId',
      details: {
        ref: 'RefSchema',
        required: true
      }
    },
    boolean: {
      type: 'Boolean',
      details: {
        default: false
      }
    },
    child: {
      type: 'Schema',
      schema: {
        _id: {
          type: 'ObjectId'
        },
        childName: {
          type: 'String',
          details: {
            maxlength: 10
          }
        }
      }
    }
  }

  t.deepEqual(parsedSchema, expectedSchema, 'parsedSchema does not match expectedSchema')
})
