import test from 'ava'

const mongoose = require('mongoose')
const path = require('path')

const schemaHelper = require(path.resolve('./lib/schema'))

const Schema = mongoose.Schema

test('get property type String', t => {
  const SampleSchema = new Schema({
    property: {
      type: String
    }
  })

  const propertyType = schemaHelper.getPropertyType(SampleSchema.obj.property)

  t.is(propertyType, 'String')
})

test('get property type Number', t => {
  const SampleSchema = new Schema({
    property: {
      type: Number
    }
  })

  const propertyType = schemaHelper.getPropertyType(SampleSchema.obj.property)

  t.is(propertyType, 'Number')
})

test('get property type Decimal128', t => {
  const SampleSchema = new Schema({
    property: {
      type: Schema.Types.Decimal128
    }
  })

  const propertyType = schemaHelper.getPropertyType(SampleSchema.obj.property)

  t.is(propertyType, 'Decimal128')
})

test('get property type Boolean', t => {
  const SampleSchema = new Schema({
    property: {
      type: Boolean
    }
  })

  const propertyType = schemaHelper.getPropertyType(SampleSchema.obj.property)

  t.is(propertyType, 'Boolean')
})

test('get property type Mixed', t => {
  const SampleSchema = new Schema({
    property: {
      type: Schema.Types.Mixed
    }
  })

  const propertyType = schemaHelper.getPropertyType(SampleSchema.obj.property)

  t.is(propertyType, 'Mixed')
})

test('get property type ObjectId', t => {
  const SampleSchema = new Schema({
    property: {
      type: Schema.Types.ObjectId
    }
  })

  const propertyType = schemaHelper.getPropertyType(SampleSchema.obj.property)

  t.is(propertyType, 'ObjectId')
})

test('get property type Date', t => {
  const SampleSchema = new Schema({
    property: {
      type: Date
    }
  })

  const propertyType = schemaHelper.getPropertyType(SampleSchema.obj.property)

  t.is(propertyType, 'Date')
})

test('get property type Buffer', t => {
  const SampleSchema = new Schema({
    property: {
      type: Buffer
    }
  })

  const propertyType = schemaHelper.getPropertyType(SampleSchema.obj.property)

  t.is(propertyType, 'Buffer')
})

test('get property type Map', t => {
  const SampleSchema = new Schema({
    property: {
      type: Map
    }
  })

  const propertyType = schemaHelper.getPropertyType(SampleSchema.obj.property)

  t.is(propertyType, 'Map')
})

test('get property type Array', t => {
  const SampleSchema = new Schema({
    property: {
      type: Array
    }
  })

  const propertyType = schemaHelper.getPropertyType(SampleSchema.obj.property)

  t.is(propertyType, 'Array')
})

test('get property type Array (defined as empty array)', t => {
  const SampleSchema = new Schema({
    property: []
  })

  const propertyType = schemaHelper.getPropertyType(SampleSchema.obj.property)

  t.is(propertyType, 'Array')
})

test('get property type ArrayOfString', t => {
  const SampleSchema = new Schema({
    property: [String]
  })

  const propertyType = schemaHelper.getPropertyType(SampleSchema.obj.property)

  t.is(propertyType, 'ArrayOfString')
})

test('get property type ArrayOfNumber', t => {
  const SampleSchema = new Schema({
    property: [Number]
  })

  const propertyType = schemaHelper.getPropertyType(SampleSchema.obj.property)

  t.is(propertyType, 'ArrayOfNumber')
})

test('get property type Object', t => {
  const SampleSchema = new Schema({
    property: {}
  })

  const propertyType = schemaHelper.getPropertyType(SampleSchema.obj.property)

  t.is(propertyType, 'Object')
})

test('get property type Schema', t => {
  const childSchema = new Schema({ 
    childProperty: 'string'
  });

  const SampleSchema = new Schema({
    property: childSchema
  })

  const propertyType = schemaHelper.getPropertyType(SampleSchema.obj.property)

  t.is(propertyType, 'Schema')
})

test('get property type ArrayOfSchema', t => {
  const childSchema = new Schema({ 
    childProperty: 'string'
  });

  const SampleSchema = new Schema({
    property: [childSchema]
  })

  const propertyType = schemaHelper.getPropertyType(SampleSchema.obj.property)

  t.is(propertyType, 'ArrayOfSchema')
})
