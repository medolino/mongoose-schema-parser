const nestedSchemaTypes = ['ArrayOfSchema']

const parseSchema = (schema) => {
  const schemaObj = getSchemaObject(schema)

  const parsedSchema = Object.keys(schemaObj).reduce((parsed, propertyName) => {
    const property = schemaObj[propertyName]
    const propertyType = getPropertyType(property)

    parsed[propertyName] = {
      type: propertyType
    }

    // parse Schema
    if (propertyType === 'Schema') { // normal schema
      let propSchema
      if (Object.prototype.hasOwnProperty.call(property, 'obj') || Object.prototype.hasOwnProperty.call(property, 'type')) {
        propSchema = property
      } else { // schema defined as object
        propSchema = { obj: property, options: {} }
      }

      parsed[propertyName].schema = parseSchema(propSchema)
    } else {
      // parse details
      const propertyDetails = parsePropertyDetails(property)

      if (propertyDetails) {
        parsed[propertyName].details = propertyDetails
      }
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
    schemaObj = getSchemaObject(schema[0])
  } else if (schema.obj) { // take obj
    schemaObj = schema.obj
    addIdToSchema = schemaHasId(schema)
  } else if (schema.type) { // get schema inside type
    // NOTE:
    // if you define subschema as type, mongoose doesn't build
    // schema like schema.obj but schema.type.obj
    schemaObj = getSchemaObject(schema.type)
  } else if (!!schema && typeof schema === 'object' && schema.constructor === Object) {
    // NOTE:
    // if you define inline schema inside array, mongoose doesn't build
    // schema like schema.obj but puts it directly in object
    schemaObj = schema
  }

  // there is no info in obj property, whether _id is present on schema,
  // so I am checking options.id property and if true, I add it manually
  if (addIdToSchema) { /* istanbul ignore function */
    schemaObj._id = { type: function ObjectId () {} }
  }

  return schemaObj
}

const schemaHasId = (schema) => Object.prototype.hasOwnProperty.call(schema, 'options') && schema.options._id

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
  if (Array.isArray(property)) {
    // handle schema definitions in array (e.g. [{ ... }])
    return parsePropertyDetails(property[0])
  }

  if (!property || !property.type) {
    return
  }

  const detailNames = Object.keys(property)

  const details = detailNames
    .reduce((details, propName) => {
      switch (propName) {
        case 'required': // convert to boolean
          details.required = !!property[propName]
          break
        case 'type':
          // handle schema definitions in array type (e.g. { type: [{ type: ... }] })
          if (Array.isArray(property[propName])) {
            const arrayDetails = parsePropertyDetails(property[propName])

            Object.assign(details, arrayDetails)
          }
          break
        default:
          details[propName] = property[propName]
      }

      return details
    }, {})

  return Object.entries(details).length > 0 ? details : undefined
}

const getMongooseArrayType = (arrayDetails) => {
  let type = 'Array'

  if (arrayDetails.length > 0) { // check if array content type is provided
    const details = arrayDetails[0]

    // details.name -> simpleTypes [String]
    // details.constructor.name -> Schema, Object

    // ignore details.name if name is schemas property, else use it as content type
    const isNameSchemaProperty = ['object', 'function'].indexOf(typeof details.name) !== -1
    let arrayContentType = (!isNameSchemaProperty) ? details.name : undefined

    if (!arrayContentType) {
      // if object - when details.type it goes for type definition, else nested schema
      // else type definition
      arrayContentType = details.constructor.name === 'Object' ? getPropertyType(details) : details.constructor.name
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
