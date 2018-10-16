import test from 'ava'

const path = require('path')

const { getOutputFormat } = require(path.resolve('./lib/format'))

test('get output format for provided name', t => {
  const outputFormat = getOutputFormat('JS')

  t.is(outputFormat, 1)
})

test('get output format for provided name in lowercase format', t => {
  const outputFormat = getOutputFormat('js')

  t.is(outputFormat, 1)
})

test('throw error if invalid name given', t => {
  const formatName = 'invalidName'

  const error = t.throws(() =>
    getOutputFormat(formatName),
  Error
  )

  t.is(error.message, `${formatName} is not a valid output format name`)
})
