const test = require('ava')
const { resolve } = require('path')

const { objectDeepMerge } = require(resolve('./lib/utils'))

test('should merge update object to source object', t => {
  const sourceObj = {
    name: 'demo01',
    desc: 'desc01',
    nested: {
      nestedName: 'demo name 01',
      nestedDesc: 'demo desc 01',
      timestamps: {
        created: new Date('1/1/2000'),
        updated: new Date('2/1/2000')
      },
      users: {
        isActive: true
      }
    },
    tempVal: 'temp value'
  }

  const updateObj = {
    name: 'updated name',
    nested: {
      nestedName: 'updated nested name',
      timestamps: {
        updated: new Date('2/1/2001'),
        deleted: new Date('2/1/2002')
      }
    },
    tempVal: undefined
  }

  objectDeepMerge(sourceObj, updateObj)

  const expectedUpdatedObj = {
    name: 'updated name',
    desc: 'desc01',
    nested: {
      nestedName: 'updated nested name',
      nestedDesc: 'demo desc 01',
      timestamps: {
        created: new Date('1/1/2000'),
        updated: new Date('2/1/2001'),
        deleted: new Date('2/1/2002')
      },
      users: {
        isActive: true
      }
    },
    tempVal: undefined
  }

  t.deepEqual(sourceObj, expectedUpdatedObj)
})
