#!/usr/bin/env node

const chalk = require('chalk')
const yargs = require('yargs')

const { parseSchemaFromFiles } = require('../')
const { findFilesByPattern, saveFile } = require('../lib/file')

const argv = yargs
  .usage('Usage: mongoose-schema-parser -h')
  .example('mongoose-schema-parser -c /path/to/project -p "**/*.model.js" -o output-schema.json', '')
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
  console.log(chalk.bgBlack('-----------------------'))
  console.log(chalk.bgBlack(` ${chalk.bold('MongooseSchemaParser')}  `))
  console.log(chalk.bgBlack('-----------------------\n'))

  console.log(`Parsing model files in: ${chalk.green(argv.cwd+'/'+chalk.green(argv.pattern))}\n`)

  const filePaths = findFilesByPattern(argv.pattern, argv.cwd)

  console.log('Number of files found:', chalk.green(filePaths.length))

  if (!filePaths.length) {
    console.log()
    process.exit(0)
  }

  const schemaParseResult = parseSchemaFromFiles(filePaths, 'json')
  
  saveFile(argv.output, schemaParseResult.schema)

  if (schemaParseResult.errors.length > 0) {
    console.log()
    console.log(chalk.red('Done with some errors:'))
    for (let errorMsg of schemaParseResult.errors) {
      console.log(chalk.red(`- ${errorMsg}`))
    }
    console.log()
  }

  console.log('Parsed models saved to:', chalk.green(argv.output))
  console.log()

  process.exit(0)
} catch (e) {
  console.log(chalk.red('An error has occured:'))
  console.log(chalk.red(e.message))
  process.exit(1)
}
