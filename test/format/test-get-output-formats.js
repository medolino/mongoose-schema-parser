const test = require('ava')
const { resolve } = require('path')

const { getOutputFormats } = require(resolve('./lib/format'))

test('return all output formats', t => {
  const outputFormats = getOutputFormats()

  const expectedFormats = {
    JS: 1,
    JSON: 2
  }

  t.deepEqual(outputFormats, expectedFormats)
})
