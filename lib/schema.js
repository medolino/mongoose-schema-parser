const nestedSchemaTypes = ['ArrayOfSchema']

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

    // parse Schema
    if (propertyType === 'Schema') { // normal schema
      let propSchema
      if (property.hasOwnProperty('obj') || property.hasOwnProperty('type')) {
        propSchema = property
      } else { // schema defined as object
        propSchema = { obj: property, options: {} }
      }

      parsed[propertyName].schema = parseSchema(propSchema)
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
  let addIdToSchema = false
  let schemaObj = 'undefined'

  if (Array.isArray(schema)) { // if ArrayOfSchema take first item from array
    // NOTE:
    // if you define inline schema inside array, mongoose doesn't build
    // schema like schema.obj but schema directly
    schemaObj = (schema[0].obj) ? schema[0].obj : schema[0]
    addIdToSchema = schemaHasId(schema[0])
  } else if (schema.obj) { // take obj
    schemaObj = schema.obj
    addIdToSchema = schemaHasId(schema)
  } else if (schema.type) { // get schema inside type
    // NOTE:
    // if you define subschema as type, mongoose doesn't build
    // schema like schema.obj but schema.type.obj
    schemaObj = getSchemaObject(schema.type)
  }

  // there is no info in obj property, whether _id is present on schema,
  // so I am checking options.id property and if true, I add it manually
  if (addIdToSchema) { /* istanbul ignore function */
    schemaObj._id = { type: function ObjectId () {} }
  }

  return schemaObj
}

const schemaHasId = (schema) => Object.prototype.hasOwnProperty.call(schema, 'options') && schema.options.id

const getPropertyType = (property) => {
  let type = 'unknown'

  /* istanbul ignore else  */
  if (property.type && property.type.name) { // simple type
    type = property.type.name
  } else if (property.type) { // nested item defined as type
    type = getPropertyType(property.type)
  } else if (property.constructor.name) { // array, object, function, string or schema
    type = getPropertyTypeFromConstructor(property)
  }

  return type
}

const getPropertyTypeFromConstructor = (property) => {
  const constructorName = property.constructor.name

  let type

  switch (constructorName) {
    case ('Array'):
      type = getMongooseArrayType(property)
      break
    case ('Function'): // simple type (e.g. String,...)
      type = property.name
      break
    case ('Object'): // Object or Schema
      type = (!Object.keys(property).length) ? 'Object' : 'Schema'
      break
    default:
      type = constructorName
  }

  return type
}

const parsePropertyDetails = (property) => {
  if (!property.type) { return }

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

    // details.name -> simpleTypes [String]
    // details.constructor.name -> Schema, Object

    // ignore details.name if name is schemas property
    const isNameSchemaProperty = ['object', 'function'].indexOf(typeof details.name) !== -1
    let arrayContentType = (!isNameSchemaProperty) ? details.name : undefined

    if (!arrayContentType) {
      // I am assuming it goes for schema, if Object is present inside Array type definition (e.g. field:[{...objProps...}])
      arrayContentType = (details.constructor.name === 'Object') ? 'Schema' : details.constructor.name
    }

    type = `ArrayOf${arrayContentType}`
  }

  return type
}

module.exports = {
  getMongooseArrayType,
  getPropertyTypeFromConstructor,
  getPropertyType,
  getSchemaObject,
  parsePropertyDetails,
  parseSchema
}
