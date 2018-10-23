import test from 'ava'

const mongoose = require('mongoose')
const path = require('path')

const { parsePropertyDetails } = require(path.resolve('./lib/schema'))

const Schema = mongoose.Schema

test('return object with property details (ref)', t => {
  const SampleSchema = new Schema({
    property: {
      type: Schema.Types.ObjectId,
      ref: 'RefSchema'
    }
  })

  const propertyDetails = parsePropertyDetails(SampleSchema.obj.property)

  const expectedDetails = { ref: 'RefSchema' }

  t.deepEqual(propertyDetails, expectedDetails)
})

test('return required true when property is required', t => {
  const SampleSchema = new Schema({
    property: {
      type: Schema.Types.ObjectId,
      required: 'property is required'
    }
  })

  const propertyDetails = parsePropertyDetails(SampleSchema.obj.property)

  const expectedDetails = { required: true }

  t.deepEqual(propertyDetails, expectedDetails)
})

test('return required false when property is required', t => {
  const SampleSchema = new Schema({
    property: {
      type: Schema.Types.ObjectId,
      required: false
    }
  })

  const propertyDetails = parsePropertyDetails(SampleSchema.obj.property)

  const expectedDetails = { required: false }

  t.deepEqual(propertyDetails, expectedDetails)
})

test('return undefined when property.type not found on property', t => {
  const propertyDetails = parsePropertyDetails({ invalid: 'property' })
  t.is(propertyDetails, undefined)
})

test('return undefined when property.type.name not found on property', t => {
  const propertyDetails = parsePropertyDetails({ type: 'without name' })
  t.is(propertyDetails, undefined)
})

test('return undefined when no details found on property', t => {
  const SampleSchema = new Schema({
    property: {
      type: Schema.Types.ObjectId
    }
  })

  const propertyDetails = parsePropertyDetails(SampleSchema.obj.property)

  t.is(propertyDetails, undefined)
})
