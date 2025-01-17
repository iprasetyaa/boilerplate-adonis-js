'use strict'

class Enum {
  constructor (enums) {
    const Enum = require('enum')
    this.enums = new Enum(enums)
    this.setKeyValue()
  }

  setKeyValue () {
    for (const enums of this.enums) {
      this[enums.key] = {
        value: enums.value,
        key: enums.key
      }
    }
  }

  getArray (option) {
    const enums = []
    this.enums.enums.forEach(function (enumItem) {
      enums.push(enumItem[option])
    })

    return enums
  }

  getString (option) {
    return this.getArray(option).toString()
  }

  getStringWithSpace (option) {
    return this.getArray(option).join(', ')
  }
}

module.exports = Enum
