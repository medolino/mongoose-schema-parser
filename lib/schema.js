const nestedSchemaTypes = ['Schema', 'ArrayOfSchema']

const parseSchema = (schema) => {
  const schemaObj = getSchemaObject(schema)

  const parsedSchema = Object.keys(schemaObj).reduce((parsed, propertyName) => {
    const property = schemaObj[propertyName]
    const propertyType = getPropertyType(property)

    parsed[propertyName] = {
      type: propertyType
    }

    const propertyDetails = parsePropertyDetails(property)
    if (propertyDetails) {
      parsed[propertyName].details = propertyDetails
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

const getSchemaObject = (schema) => {
  let schemaObj = 'undefined'

  if (Array.isArray(schema)) { // if ArrayOfSchema take first item from array
    schemaObj = schema[0].obj
  } else if (schema.obj) { // take obj
    schemaObj = schema.obj
  } else if (schema.type) { // get schema inside type
    // NOTE:
    // if you define subschema as type, mongoose doesn't build
    // schema like schema.obj but schema.type.obj
    schemaObj = getSchemaObject(schema.type)
  }

  return schemaObj
}

const getPropertyType = (property) => {
  let type = 'unknown'

  /* istanbul ignore else  */
  if (property.type && property.type.name) { // simple type
    type = property.type.name
  } else if (property.type) { // nested item defined as type
    type = getPropertyType(property.type)
  } else if (property.constructor.name) { // array, object, string or schema
    const conName = property.constructor.name
    type = (conName === 'Array') ? getMongooseArrayType(property) : conName
  }

  return type
}

const parsePropertyDetails = (property) => {
  if (!property.type || !property.type.name) { return }

  const detailNames = Object.keys(property)

  const details = detailNames
    .filter(propName => propName !== 'type')
    .reduce((details, propName) => {
      switch (propName) {
        case ('required'): // convert to boolean
          details.required = !!property[propName]
          break
        default:
          details[propName] = property[propName]
      }

      return details
    }, detailNames.length > 1 ? {} : undefined)

  return details
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
  getMongooseArrayType,
  getPropertyType,
  getSchemaObject,
  parsePropertyDetails,
  parseSchema
}
