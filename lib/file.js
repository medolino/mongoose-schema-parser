const glob = require('glob')
const path = require('path')

const findFilesByPattern = (pattern, cwd) => {
  const filePaths = glob
    .sync(pattern, { cwd })
    .map(fileName => path.join(cwd, fileName))

  return filePaths
}

// TODO: add save to file function

module.exports = {
  findFilesByPattern
}
