const test = require('ava')
const { Schema } = require('mongoose')
const { resolve } = require('path')

const schemaHelper = require(resolve('./lib/schema'))

test('get type Array from mongooseSchema', t => {
  const SampleSchema = new Schema({
    property: []
  })

  const propertyType = schemaHelper.getMongooseArrayType(SampleSchema.obj.property)

  t.is(propertyType, 'Array')
})

test('get type ArrayOfString from mongooseSchema', t => {
  const SampleSchema = new Schema({
    property: [String]
  })

  const propertyType = schemaHelper.getMongooseArrayType(SampleSchema.obj.property)

  t.is(propertyType, 'ArrayOfString')
})

test('get type ArrayOfSchema from mongooseSchema when Object is passed inside Array', t => {
  const SampleSchema = new Schema({
    property: [{
      fieldName: String
    }]
  })

  const propertyType = schemaHelper.getMongooseArrayType(SampleSchema.obj.property)

  t.is(propertyType, 'ArrayOfSchema')
})
