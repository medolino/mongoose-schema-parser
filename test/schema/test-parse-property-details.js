const test = require('ava')
const { Schema } = require('mongoose')
const { resolve } = require('path')

const { parsePropertyDetails } = require(resolve('./lib/schema'))

const { Types } = Schema

test('return object with property details (ref)', t => {
  const SampleSchema = new Schema({
    property: {
      type: Types.ObjectId,
      ref: 'RefSchema'
    }
  })

  const propertyDetails = parsePropertyDetails(SampleSchema.obj.property)
  const expectedDetails = { ref: 'RefSchema' }

  t.deepEqual(propertyDetails, expectedDetails)
})

test('return object with property details when property type is ArrayOfObjectId', t => {
  const SampleSchema = new Schema({
    property: [{
      type: Types.ObjectId,
      ref: 'RefSchema'
    }]
  })

  const propertyDetails = parsePropertyDetails(SampleSchema.obj.property)
  const expectedDetails = { ref: 'RefSchema' }

  t.deepEqual(propertyDetails, expectedDetails)
})

test('return object with property details when property type is ArrayOfObjectId and is defined as type', t => {
  const SampleSchema = new Schema({
    property: {
      type: [{
        type: Types.ObjectId,
        ref: 'RefSchema'
      }]
    }
  })

  const propertyDetails = parsePropertyDetails(SampleSchema.obj.property)
  const expectedDetails = { ref: 'RefSchema' }

  t.deepEqual(propertyDetails, expectedDetails)
})

test('return object without property details when property type is ArrayOfObjectId, but no other details are specified', t => {
  const SampleSchema = new Schema({
    property: {
      type: [{
        type: Types.ObjectId
      }]
    }
  })

  const propertyDetails = parsePropertyDetails(SampleSchema.obj.property)

  t.is(propertyDetails, undefined)
})

test('return object without property details when property type is ArrayOfObjectId, and type is defined directly', t => {
  const SampleSchema = new Schema({
    property: {
      type: [Types.ObjectId]
    }
  })

  const propertyDetails = parsePropertyDetails(SampleSchema.obj.property)

  t.is(propertyDetails, undefined)
})

test('return required true when property is required', t => {
  const SampleSchema = new Schema({
    property: {
      type: Types.ObjectId,
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
      type: Types.ObjectId,
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
      type: Types.ObjectId
    }
  })

  const propertyDetails = parsePropertyDetails(SampleSchema.obj.property)

  t.is(propertyDetails, undefined)
})
