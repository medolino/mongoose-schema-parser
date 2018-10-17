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

  let mongoose

  try {
    mongoose = findChildModule(module, 'Mongoose')
  } catch (e) {
    throw new Error('Mongoose instance cannot be found')
  }

  return parseSchemaFromMongoose(mongoose, formatName)
}

const findChildModule = (moduleItem, name) => {
  for (const child of moduleItem.children) {
    try {
      const childModule = require(child.id)
      const moduleName = childModule.name || childModule.constructor.name

      if (moduleName === name) {
        return childModule
      } else {
        throw new Error('Module does not match')
      }
    } catch (e) {
      if (child.children && child.children.length > 0) {
        // NOTE:
        // I am assuming there is not a lot of dependencies in model files
        // so I am returning to prevent maximum call stack size exceeded
        return findChildModule(child, name)
      }
    }
  }

  throw new Error(`Module ${name} not found`)
}

module.exports = {
  findChildModule,
  parseSchemaFromFiles,
  parseSchemaFromMongoose
}
