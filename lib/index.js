const path = require('path')

const parseSchema = require('./schema').parseSchema

const parseSchemaFromMongoose = (mongooseInstance) => {
  if (typeof (mongooseInstance) !== 'object' || mongooseInstance.constructor.name !== 'Mongoose') {
    throw new TypeError('mongooseInstance should be an instance of mongoose')
  }

  const modelNames = mongooseInstance.modelNames()

  const databaseSchema = modelNames.reduce((schema, modelName) => {
    const model = mongooseInstance.model(modelName)

    schema[modelName] = { schema: parseSchema(model.schema) }

    return schema
  }, {})

  return databaseSchema
}

const parseSchemaFromFiles = (filePaths) => {
  const models = filePaths
    .map(filePath => require(path.resolve(filePath))
  )

  const mongoose = require('mongoose')
  
  return parseSchemaFromMongoose(mongoose)
}

module.exports = {
  parseSchemaFromFiles,
  parseSchemaFromMongoose
}
