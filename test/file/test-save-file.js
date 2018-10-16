import test from 'ava'

const fs = require('fs')
const path = require('path')

const { saveFile } = require(path.resolve('./lib/file'))

const demoFilePath = `${process.cwd()}/test/temp/test-save-file.txt`

test.serial('save file with provided data', t => {
  const data = 'demo data'

  saveFile(demoFilePath, data)

  t.true(fs.existsSync(demoFilePath))

  const readContent = fs.readFileSync(demoFilePath, 'utf8')
  t.is(readContent, data)
})

test.serial('throw error if path does not exist', t => {
  const path = `invalidpath/test.txt`
  const data = 'demo data'

  const error = t.throws(() =>
    saveFile(path, data),
  Error
  )

  t.is(error.message, `ENOENT: no such file or directory, open '${path}'`)
})

test.afterEach.always(t => {
  // remove file created during test if exists
  if (fs.existsSync(demoFilePath)) {
    fs.unlinkSync(demoFilePath)
  }
})
