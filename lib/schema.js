const nestedSchemaTypes = ['Schema', 'ArrayOfSchema']

const parseSchema = (schema) => {
  // if ArrayOfSchema take first item from array
  const schemaObj = (!Array.isArray(schema)) ? schema.obj : schema[0].obj

  const parsedSchema = Object.keys(schemaObj).reduce((parsed, propertyName) => {
    const property = schemaObj[propertyName]

    const propertyType = getPropertyType(property)
    
    parsed[propertyName] = {
      type: propertyType
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
  parseSchema
}