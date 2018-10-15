const path = require('path')

const schemaHelper = require(path.resolve('./lib/schema'))

// TODO: 
// add parse from mongoose

const parseSchemaFromFiles = (filePaths) => {
  const models = filePaths
    .map(filePath => require(path.resolve(filePath))
  )

  const mongoose = require('mongoose')
  
  return schemaHelper.exportDatabaseSchema(mongoose)
}

module.exports = {
  parseSchemaFromFiles
}
