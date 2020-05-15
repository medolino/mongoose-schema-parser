const test = require('ava')
const { resolve } = require('path')

const { findFilesByPattern } = require(resolve('./lib/file'))

test('find file by patern', t => {
  const pattern = '**/example-0*.js'
  const cwd = process.cwd()

  const filePaths = findFilesByPattern(pattern, cwd)

  const expectedResult = [`${cwd}/test/test-files/example-01.js`]

  t.deepEqual(filePaths, expectedResult)
})

test('return empty array when no file found', t => {
  const pattern = 'nofile'
  const cwd = process.cwd()

  const filePaths = findFilesByPattern(pattern, cwd)

  t.deepEqual(filePaths, [])
})
