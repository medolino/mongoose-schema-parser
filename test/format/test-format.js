import test from 'ava'

const path = require('path')

const { format } = require(path.resolve('./lib/format'))

test('return data in JS format when no format provided', t => {
  const data = {
    test: 'demo data'
  }

  const outputData = format(data)

  t.deepEqual(outputData, data)
})

test('return data in JS format', t => {
  const data = {
    test: 'demo data'
  }

  const outputData = format(data, 'js')

  t.deepEqual(outputData, data)
})

test('return data in JSON format', t => {
  const data = {
    test: 'demo data'
  }

  const outputData = format(data, 'json')

  const expectedOutputData = JSON.stringify(data)

  t.deepEqual(outputData, expectedOutputData)
})
