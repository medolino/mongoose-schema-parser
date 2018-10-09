import test from 'ava'

const mongoose = require('mongoose')
const path = require('path')

const schemaHelper = require(path.resolve('./lib/schema'))

const Schema = mongoose.Schema

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