const fs = require('fs')
const glob = require('glob')
const path = require('path')

const findFilesByPattern = (pattern, cwd) => {
  const filePaths = glob
    .sync(pattern, { cwd })
    .map(fileName => path.join(cwd, fileName))

  return filePaths
}

const saveFile = (filePath, data) => {
  return fs.writeFileSync(filePath, data)
}

module.exports = {
  findFilesByPattern,
  saveFile
}
