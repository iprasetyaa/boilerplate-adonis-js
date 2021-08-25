'use strict'

const Antl = use('Antl')
const { failResponse } = use('utils/Validators')

class RefreshTokenRequest {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      refresh_token: 'required'
    }
  }

  get messages () {
    return {
      'refresh_token.required': Antl.formatMessage('validation.required', { attribute: 'refresh_token' })
    }
  }

  async fails (errorMessages) {
    return failResponse(this.ctx, errorMessages)
  }
}

module.exports = RefreshTokenRequest