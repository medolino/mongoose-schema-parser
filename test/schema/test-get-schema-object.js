import test from 'ava'

const path = require('path')

const schemaHelper = require(path.resolve('./lib/schema'))

test('get schema from array', t => {
  const schema = [
    { obj: 'demo schema' }
  ]

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.is(schemaObj, schema[0].obj)
})

test('get schema from obj', t => {
  const schema = { obj: 'demo schema' }

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.is(schemaObj, schema.obj)
})

test('get schema from type', t => {
  const schema = {
    type: {
      obj: 'demo schema'
    }
  }

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.is(schemaObj, schema.type.obj)
})

test('return undefined if invalid schema given', t => {
  const schema = 'invalid schema'

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.is(schemaObj, 'undefined')
})
