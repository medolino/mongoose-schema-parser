const test = require('ava')
const { Schema } = require('mongoose')
const { resolve } = require('path')

const schemaHelper = require(resolve('./lib/schema'))

const { Types } = Schema

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
      type: Types.Decimal128
    },
    boolean: {
      type: Boolean,
      default: false
    },
    mixed: {
      type: Types.Mixed
    },
    objectId: {
      type: Types.ObjectId,
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
    arrayOfNumbers: [Number],
    arrayOfObjectId: [Types.ObjectId]
  })

  const parsedSchema = schemaHelper.parseSchema(SampleSchema)

  const expectedSchema = {
    _id: { type: 'ObjectId' },
    string: { type: 'String', details: { maxlength: 10 } },
    number: { type: 'Number', details: { required: true } },
    decimal: { type: 'Decimal128' },
    boolean: { type: 'Boolean', details: { default: false } },
    mixed: { type: 'Mixed' },
    objectId: { type: 'ObjectId', details: { ref: 'Country' } },
    date: { type: 'Date' },
    buffer: { type: 'Buffer' },
    map: { type: 'Map' },
    arrayWithType: { type: 'Array' },
    arrayEmpty: { type: 'Array' },
    arrayOfStrings: { type: 'ArrayOfString' },
    arrayOfNumbers: { type: 'ArrayOfNumber' },
    arrayOfObjectId: { type: 'ArrayOfObjectId' }
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

test('differ between nested array of schema defined inline and nested array of single values', t => {
  const MainSchema = new Schema({
    nestedArrayOfStrings: [{
      type: String
    }],
    nestedSchemas: [{
      childString: String
    }]
  })

  const parsedSchema = schemaHelper.parseSchema(MainSchema)

  const expectedSchema = {
    _id: { type: 'ObjectId' },
    nestedArrayOfStrings: { type: 'ArrayOfString' },
    nestedSchemas: {
      type: 'ArrayOfSchema',
      schema: {
        childString: { type: 'String' }
      }
    }
  }

  t.deepEqual(parsedSchema, expectedSchema, 'parsedSchema does not match expectedSchema')
})

test('differ between nested array of schema defined as subschema and nested array of single values', t => {
  const childSchema = new Schema({
    childString: 'string'
  })

  const MainSchema = new Schema({
    nestedArrayOfStrings: [{
      type: String
    }],
    nestedSchemas: [{
      type: childSchema
    }]
  })

  const parsedSchema = schemaHelper.parseSchema(MainSchema)

  const expectedSchema = {
    _id: { type: 'ObjectId' },
    nestedArrayOfStrings: { type: 'ArrayOfString' },
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

test('parse schema with details', t => {
  const childSchema = new Schema({
    childName: {
      type: String,
      maxlength: 10
    }
  })

  const SampleSchema = new Schema({
    objectId: {
      type: Types.ObjectId,
      ref: 'RefSchema',
      required: true
    },
    boolean: {
      type: Boolean,
      default: false
    },
    child: childSchema,
    childArray: [{
      type: Types.ObjectId,
      ref: 'ChildRefSchema'
    }],
    childArrayWithType: {
      type: [{
        type: Types.ObjectId,
        ref: 'ChildRefSchema'
      }]
    }
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
    },
    childArray: {
      type: 'ArrayOfObjectId',
      details: {
        ref: 'ChildRefSchema'
      }
    },
    childArrayWithType: {
      type: 'ArrayOfObjectId',
      details: {
        ref: 'ChildRefSchema'
      }
    }
  }

  t.deepEqual(parsedSchema, expectedSchema, 'parsedSchema does not match expectedSchema')
})
