const outputFormats = {
  JS: 1,
  JSON: 2
}

const getOutputFormat = (formatName) => {
  const name = formatName.toUpperCase()

  if (formatName && !Object.prototype.hasOwnProperty.call(outputFormats, name)) {
    throw new Error(`${formatName} is not a valid output format name`)
  }

  return outputFormats[name]
}

const getOutputFormats = () => outputFormats

const format = (data, formatName = 'js') => {
  const formatId = getOutputFormat(formatName)

  let formatedData

  switch (formatId) {
    case outputFormats.JS:
      formatedData = data
      break
    case outputFormats.JSON:
      formatedData = JSON.stringify(data, null, 2)
      break
  }

  return formatedData
}

module.exports = {
  format,
  getOutputFormat,
  getOutputFormats
}
