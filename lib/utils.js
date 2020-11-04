const isObject = (value) =>
  !!value && typeof value === 'object' && value.constructor === Object

const objectDeepMerge = (dstObj, srcObj) => {
  for (const [fieldName, srcValue] of Object.entries(srcObj)) {
    if (isObject(srcValue)) {
      // Cannot merge to undefined, have to set empty object
      if (typeof dstObj[fieldName] === 'undefined') {
        dstObj[fieldName] = {}
      }

      const dstObjNextLevel = dstObj[fieldName]

      objectDeepMerge(dstObjNextLevel, srcValue)
    } else {
      dstObj[fieldName] = srcValue
    }
  }

  return dstObj
}

const hasOwnProperty = (obj, property) => Object.prototype.hasOwnProperty.call(obj, property)

module.exports = {
  isObject,
  objectDeepMerge,
  hasOwnProperty
}
