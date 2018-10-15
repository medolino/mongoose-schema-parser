const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ExampleSchema = new Schema({
  name: 'string'
})

mongoose.model('exampleSchema', ExampleSchema)

