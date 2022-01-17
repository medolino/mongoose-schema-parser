const { objectDeepMerge, hasOwnProperty } = require('./utils')

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
      if (hasOwnProperty(property, 'obj') || hasOwnProperty(property, 'tree') || hasOwnProperty(property, 'type')) {
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

/**
 * Generate specific timestamp field.
 * When field is nested also create nested schemas, which lead to final field.
 *
 * @param  {Array}  path - Path to timestamp field
 * @return {Object} Returns generted schema.
 */
const _assembleTimestampFieldSchema = (path = []) => {
  if (!path.length) { // handle non nested field
    return { type: Date }
  }

  if (path.length <= 1) { // path end property -> add date schema and finish
    return { [path]: { type: Date } }
  }

  const [pathPartName, ...pathParts] = path

  // timestamp field is nested -> create nested schema and go further
  const schema = function Schema () {} /* istanbul ignore function */
  schema.name = 'Schema'

  schema.obj = {
    [pathPartName]: _assembleTimestampFieldSchema(pathParts)
  }

  return schema
}

/**
 * Generate timestamp fields schema based on provided config.
 *
 * @param  {Object} options - Mongoose timestamp options
 * @return {Object} Returns generated timestamp fields schema.
 */
const _generateTimestampFiledsSchema = (options = {}) => {
  // handle default fields
  if (options === true || Object.keys(options).join('') === 'currentTime') {
    return {
      createdAt: { type: Date },
      updatedAt: { type: Date }
    }
  }

  const { createdAt, updatedAt } = options

  // handle custom fields
  const fields = [createdAt, updatedAt].reduce((schema, timestampParamName, ix) => {
    if (!timestampParamName) {
      return schema
    }

    const fieldPath = timestampParamName.split('.')
    const fieldName = fieldPath.shift()

    if (!schema[fieldName]) {
      schema[fieldName] = {}
    }

    schema[fieldName] = objectDeepMerge(schema[fieldName], _assembleTimestampFieldSchema(fieldPath))

    return schema
  }, {})

  return fields
}

/**
 * Parse data from schema options and manually generate specific fields, which are then added to parsed schema (_id and timestamps).
 * NOTE:
 * I am handling option fields this way, because I am parsing schema.obj property, where this fields are not present.
 *
 * @param  {Object} options - Mongoose schema options
 * @return {Object} Returns generated option fields schemas (_id, timestamps)
 */
const _getOptionFields = (options) => {
  const fields = {}

  // add _id field schema
  if (options._id === true) {
    fields._id = { type: function ObjectId () {} } /* istanbul ignore function */
  }

  // add timestamp fields schema
  if (options.timestamps) {
    const timestampFields = _generateTimestampFiledsSchema(options.timestamps)

    Object.assign(fields, timestampFields)
  }

  return fields
}

const getSchemaObject = (schema) => {
  let schemaObj = 'undefined'

  if (Array.isArray(schema)) { // if ArrayOfSchema take first item from array
    schemaObj = getSchemaObject(schema[0])
  } else if (schema.obj || schema.tree) { // take obj
    const additionalFileds = schema.options ? _getOptionFields(schema.options) : {}

    schemaObj = { ...(schema.obj || schema.tree), ...additionalFileds }
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

  return schemaObj
}

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
