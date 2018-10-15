#!/usr/bin/env node

const yargs = require('yargs')

const { parseSchemaFromFiles, outputFormats } = require('../lib')
const { findFilesByPattern } = require('../lib/file')

const argv = require('yargs')
  .usage('Usage: mongoose-schema-parser ')
  .example(`mongoose-schema-parser`, '')
  .options({
    c: {
      alias: 'cwd',
      describe: 'Current working directory',
      type: 'string',
      default: process.cwd(),
    },
    p: {
      alias: 'pattern',
      describe: 'Search file pattern',
      default: '**/*.model.js',
      type: 'string',
      required: true
    },
    o: {
      alias: 'output',
      describe: 'Output file path',
      type: 'string',
      required: true
    },
    f: {
      alias: 'format',
      describe: 'Output file format',
      choices: outputFormats,
      default: 'js'
    }
  })
  .help('help')
  .alias('help', 'h')
  .version(false)
  .wrap(100)
  .argv

const filePaths = findFilesByPattern(argv.pattern, argv.cwd)

const schema = parseSchemaFromFiles(filePaths)

console.log(schema)

// TODO: export to file