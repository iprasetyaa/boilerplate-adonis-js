'use strict'

const { OAuth2Client } = require('google-auth-library')
const Config = use('Config')
const User = use('App/Models/User')
const { StatusCodes } = require('http-status-codes')
const CustomException = use('App/Exceptions/CustomException')
const Antl = use('Antl')
const googleClientId = Config.get('service.google.clientId')
const googleClient = new OAuth2Client(googleClientId)
const { responseToken } = use('Common/Models')

class OauthController {
  async signInWithGoogle ({ response, auth }) {
    try {
      const payload = await googleClient.getTokenInfo(auth.getAuthHeader())
      const user = await this.getUserByOauthCode(payload)
      const token = await auth.withRefreshToken().generate(user)
      return response.json(await responseToken(auth, token))
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  async signUpWithGoogle ({ response, auth, request }) {
    try {
      const payload = await googleClient.getTokenInfo(auth.getAuthHeader())

      await this.checkValidSignUpGoogle(request, payload)

      const user = new User()
      user.email = request.input('email')
      user.username = request.input('name')
      user.avatar = request.input('picture')
      user.oauth_code = request.input('sub')
      user.role = request.input('role')
      user.password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      await user.save()

      const token = await auth.withRefreshToken().generate(user)
      return response.json(await responseToken(auth, token))
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  async checkValidSignUpGoogle (request, payload) {
    if (
      request.input('email') != payload.email ||
      request.input('sub') != payload.sub
    ) {
      throw new CustomException(Antl.formatMessage('auth.register_not_match'), StatusCodes.UNAUTHORIZED)
    }
  }

  async getUserByOauthCode (payload) {
    const user = await User.query()
      .where('oauth_code', payload.sub)
      .orWhere('email', payload.email)
      .first()

    if (!user) {
      throw new CustomException(Antl.formatMessage('auth.user_not_exist'), StatusCodes.UNAUTHORIZED)
    }

    if (!user.oauth_code) {
      await User.update({ oauth_code: payload.sub })
    }

    return user
  }
}

module.exports = OauthController
