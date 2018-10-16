const path = require('path')

const { parseSchema } = require('./schema')
const { format } = require('./format')

const parseSchemaFromMongoose = (mongooseInstance, formatName = 'js') => {
  if (typeof (mongooseInstance) !== 'object' || mongooseInstance.constructor.name !== 'Mongoose') {
    throw new TypeError('mongooseInstance should be an instance of mongoose')
  }

  const modelNames = mongooseInstance.modelNames()

  const databaseSchema = modelNames.reduce((schema, modelName) => {
    const model = mongooseInstance.model(modelName)

    schema[modelName] = { schema: parseSchema(model.schema) }

    return schema
  }, {})

  const outputSchema = format(databaseSchema, formatName)

  return outputSchema
}

const parseSchemaFromFiles = (filePaths, formatName = 'js') => {
  filePaths
    .map(filePath => require(path.resolve(filePath)))

  const mongoose = require('mongoose')

  return parseSchemaFromMongoose(mongoose, formatName)
}

module.exports = {
  parseSchemaFromFiles,
  parseSchemaFromMongoose
}
