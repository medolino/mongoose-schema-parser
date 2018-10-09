const mongoose = require('mongoose')

const nestedSchemaTypes = ['Schema', 'ArrayOfSchema']

const exportDatabaseSchema = (mongooseInstance) => {
  if (typeof(mongooseInstance) !== 'object' || mongooseInstance.constructor.name !== 'Mongoose') {
    throw new TypeError('mongooseInstance should be an instance of mongoose')
  }

  const modelNames = mongooseInstance.modelNames()

  const databaseSchema = modelNames.reduce((schema, modelName) => {
    const model = mongoose.model(modelName)

    schema[modelName] = { schema: parseSchema(model.schema) }

    return schema
  }, {})

  return databaseSchema
}

const parseSchema = (schema) => {
  // if ArrayOfSchema take first item from array
  const schemaObj = (!Array.isArray(schema)) ? schema.obj : schema[0].obj

  const parsedSchema = Object.keys(schemaObj).reduce((parsed, propertyName) => {
    const property = schemaObj[propertyName]

    const propertyType = getPropertyType(property)

    parsed[propertyName] = {
      type: propertyType
    }

    // parse Object
    if (propertyType === 'Object') {
      parsed[propertyName].schema = parseSchema({ obj: property })
    }
  
    // check if nested schema    
    if (nestedSchemaTypes.indexOf(propertyType) !== -1) {
      parsed[propertyName].schema = parseSchema(property)
    }

    return parsed
  }, {})

  return parsedSchema
}

const getPropertyType = (property) => {
  let type = 'unknown'

  if (property.type && property.type.name) {
    type = property.type.name
  } else if (property.constructor.name) {
    const conName = property.constructor.name
    type = (conName === 'Array') ? getMongooseArrayType(property) : conName
  }

  return type
}

const getMongooseArrayType = (arrayDetails) => {
  let type = 'Array'

  if (arrayDetails.length > 0) { // check if array content type is provided
    const details = arrayDetails[0]
    const arrayContentType = (details.name) ? details.name : details.constructor.name
    type = `ArrayOf${arrayContentType}`
  }

  return type
}

module.exports = {
  exportDatabaseSchema,
  getMongooseArrayType,
  getPropertyType,
  parseSchema
}