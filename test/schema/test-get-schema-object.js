const test = require('ava')
const { resolve } = require('path')

const schemaHelper = require(resolve('./lib/schema'))

test('get schema from array', t => {
  const schema = [
    { obj: 'demo schema', options: {} }
  ]

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.is(schemaObj, schema[0].obj)
})

test('get schema from obj', t => {
  const schema = { obj: 'demo schema', options: {} }

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.is(schemaObj, schema.obj)
})

test('get schema from type', t => {
  const schema = {
    type: {
      obj: 'demo schema',
      options: {}
    }
  }

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.is(schemaObj, schema.type.obj)
})

test('manually add _id to schema, if options.id is true', t => {
  const schema = {
    obj: {
      name: 'demo'
    },
    options: {
      id: true
    }
  }

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.true(Object.prototype.hasOwnProperty.call(schemaObj, '_id'))
  t.true(Object.prototype.hasOwnProperty.call(schemaObj._id, 'type'))
  t.true(schemaObj._id.type.name === 'ObjectId')
  schemaObj._id.type()
})

test('manually add _id to schema in array, if options.id is true', t => {
  const schema = [{
    obj: {
      name: 'demo'
    },
    options: {
      id: true
    }
  }]

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.true(Object.prototype.hasOwnProperty.call(schemaObj, '_id'))
  t.true(Object.prototype.hasOwnProperty.call(schemaObj._id, 'type'))
  t.true(schemaObj._id.type.name === 'ObjectId')
  schemaObj._id.type()
})

test('return undefined if invalid schema given', t => {
  const schema = 'invalid schema'

  const schemaObj = schemaHelper.getSchemaObject(schema)

  t.is(schemaObj, 'undefined')
})
