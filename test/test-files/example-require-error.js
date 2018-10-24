const mongoose = require('mongoose')
require('nonExistingDependency')

const Schema = mongoose.Schema

const Example02Schema = new Schema({
  name: 'string'
})

mongoose.model('example02Schema', Example02Schema)
