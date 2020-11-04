const test = require('ava')
const { resolve } = require('path')

const { hasOwnProperty } = require(resolve('./lib/utils'))
const schemaHelper = require(resolve('./lib/schema'))

test('get schema from array', t => {
  const schema = [{
    obj: {
      name: 'test'
    },
    options: {}
  }]

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.deepEqual(schemaObj, schema[0].obj)
})

test('get schema from obj', t => {
  const schema = {
    obj: {
      name: 'test'
    },
    options: {}
  }

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.deepEqual(schemaObj, schema.obj)
})

test('get schema from type', t => {
  const schema = {
    type: {
      obj: {
        name: 'test'
      },
      options: {}
    }
  }

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.deepEqual(schemaObj, schema.type.obj)
})

test('manually add _id to schema, if options.id is true', t => {
  const schema = {
    obj: {
      name: 'demo'
    },
    options: {
      _id: true
    }
  }

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.true(hasOwnProperty(schemaObj, '_id'))
  t.true(hasOwnProperty(schemaObj._id, 'type'))
  t.true(schemaObj._id.type.name === 'ObjectId')
  schemaObj._id.type()
})

test('skip adding _id to schema, if options.id is false', t => {
  const schema = {
    obj: {
      name: 'demo'
    },
    options: {
      _id: false
    }
  }

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.false(hasOwnProperty(schemaObj, '_id'))
})

test('manually add _id to schema in array, if options.id is true', t => {
  const schema = [{
    obj: {
      name: 'demo'
    },
    options: {
      _id: true
    }
  }]

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.true(hasOwnProperty(schemaObj, '_id'))
  t.true(hasOwnProperty(schemaObj._id, 'type'))
  t.true(schemaObj._id.type.name === 'ObjectId')
  schemaObj._id.type()
})

test('skip adding _id to schema in array, if options.id is true', t => {
  const schema = [{
    obj: {
      name: 'demo'
    },
    options: {
      _id: false
    }
  }]

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.false(hasOwnProperty(schemaObj, '_id'))
})

test('manually add default timestamps fields (createdAt, updatedAt) to schema in array, if options.timestamps is true', t => {
  const schema = [{
    obj: {
      name: 'demo'
    },
    options: {
      timestamps: true
    }
  }]

  const schemaObj = schemaHelper.getSchemaObject(schema)

  const fieldsToValidate = ['createdAt', 'updatedAt']

  for (const fieldName of fieldsToValidate) {
    t.true(hasOwnProperty(schemaObj, fieldName))
    t.true(hasOwnProperty(schemaObj[fieldName], 'type'))
    t.true(schemaObj[fieldName].type.name === 'Date')
    schemaObj[fieldName].type()
  }
})

test('manually add default timestamps fields (createdAt, updatedAt) to schema, if options.timestamps is true', t => {
  const schema = {
    obj: {
      name: 'demo'
    },
    options: {
      timestamps: true
    }
  }

  const schemaObj = schemaHelper.getSchemaObject(schema)

  const fieldsToValidate = ['createdAt', 'updatedAt']

  for (const fieldName of fieldsToValidate) {
    t.true(hasOwnProperty(schemaObj, fieldName))
    t.true(hasOwnProperty(schemaObj[fieldName], 'type'))
    t.true(schemaObj[fieldName].type.name === 'Date')
    schemaObj[fieldName].type()
  }
})

test('manually add default timestamps fields (createdAt, updatedAt) to schema, if options.timestamps has only currentTime property', t => {
  const schema = {
    obj: {
      name: 'demo'
    },
    options: {
      timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
    }
  }

  const schemaObj = schemaHelper.getSchemaObject(schema)

  const fieldsToValidate = ['createdAt', 'updatedAt']

  for (const fieldName of fieldsToValidate) {
    t.true(hasOwnProperty(schemaObj, fieldName))
    t.true(hasOwnProperty(schemaObj[fieldName], 'type'))
    t.true(schemaObj[fieldName].type.name === 'Date')
    schemaObj[fieldName].type()
  }
})

test('manually add custom timestamps fields to schema, if custom field names provided in options.timestamps', t => {
  const schema = {
    obj: {
      name: 'demo'
    },
    options: {
      timestamps: {
        createdAt: 'customCreatedAt',
        updatedAt: 'customUpdatedAt'
      }
    }
  }

  const schemaObj = schemaHelper.getSchemaObject(schema)

  const fieldsToValidate = ['customCreatedAt', 'customUpdatedAt']

  for (const fieldName of fieldsToValidate) {
    t.true(hasOwnProperty(schemaObj, fieldName))
    t.true(hasOwnProperty(schemaObj[fieldName], 'type'))
    t.true(schemaObj[fieldName].type.name === 'Date')
    schemaObj[fieldName].type()
  }
})

test('manually add only one custom timestamps field to schema, if only one provided in options.timestamps', t => {
  const schema = {
    obj: {
      name: 'demo'
    },
    options: {
      timestamps: {
        createdAt: 'customCreatedAt'
      }
    }
  }

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.true(hasOwnProperty(schemaObj, 'customCreatedAt'))
  t.true(hasOwnProperty(schemaObj.customCreatedAt, 'type'))
  t.true(schemaObj.customCreatedAt.type.name === 'Date')
  schemaObj.customCreatedAt.type()

  t.false(hasOwnProperty(schemaObj, 'updatedAt'))
})

test('manually add custom timestamps nested fields to schema, if custom field definition name is separated by dots', t => {
  const schema = {
    obj: {
      name: 'demo'
    },
    options: {
      timestamps: {
        createdAt: 'customTimestamp.createdField',
        updatedAt: 'customTimestamp.updatedField'
      }
    }
  }

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.true(hasOwnProperty(schemaObj, 'customTimestamp'))

  const expectedSchema = {
    createdField: {
      type: Date
    },
    updatedField: {
      type: Date
    }
  }

  t.deepEqual(schemaObj.customTimestamp, expectedSchema)
})

test('manually add custom timestamps nested fields to schema, if custom field definition name is separated by dots 2 levels deep', t => {
  const schema = {
    obj: {
      name: 'demo'
    },
    options: {
      timestamps: {
        createdAt: 'customTimestamp.dateField.createdField',
        updatedAt: 'customTimestamp.dateField.updatedField'
      }
    }
  }

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.true(hasOwnProperty(schemaObj, 'customTimestamp'))

  const expectedSchema = {
    obj: {
      dateField: {
        createdField: {
          type: Date
        },
        updatedField: {
          type: Date
        }
      }
    }
  }

  t.deepEqual(schemaObj.customTimestamp, expectedSchema)
})

test('manually add custom timestamps nested fields with different paths to schema', t => {
  const schema = {
    obj: {
      name: 'demo'
    },
    options: {
      timestamps: {
        createdAt: 'createdTimestamp.createdField',
        updatedAt: 'updatedTimestamp.updatedField'
      }
    }
  }

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.true(hasOwnProperty(schemaObj, 'createdTimestamp'))

  const createExpectedSchema = {
    createdField: {
      type: Date
    }
  }

  t.deepEqual(schemaObj.createdTimestamp, createExpectedSchema)

  t.true(hasOwnProperty(schemaObj, 'updatedTimestamp'))

  const updateExpectedSchema = {
    updatedField: {
      type: Date
    }
  }

  t.deepEqual(schemaObj.updatedTimestamp, updateExpectedSchema)
})

test('return undefined if invalid schema given', t => {
  const schema = 'invalid schema'

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.is(schemaObj, 'undefined')
})
