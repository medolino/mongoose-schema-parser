#!/usr/bin/env node

const chalk = require('chalk')
const yargs = require('yargs')

const { parseSchemaFromFiles } = require('../lib')
const { findFilesByPattern, saveFile } = require('../lib/file')

const argv = yargs
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
    }
  })
  .help('help')
  .alias('help', 'h')
  .version(false)
  .wrap(100)
  .argv

try {
  console.log(chalk.dim('======================'))
  console.log(chalk.dim(' MongooseSchemaParser '))
  console.log(chalk.dim('======================'))

  const filePaths = findFilesByPattern(argv.pattern, argv.cwd)

  console.log('Number of files found:', chalk.bold(filePaths.length))
  
  const schema = parseSchemaFromFiles(filePaths, 'json')
  
  saveFile(argv.output, schema)

  console.log('File saved to:', chalk.bold(argv.output))
  console.log()

  process.exit(0)
} catch (e) {
  console.log(chalk.red('An error has occured:'))
  console.log(chalk.red(e.message))
  process.exit(1)
}
