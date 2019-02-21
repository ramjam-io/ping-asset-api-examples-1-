import config from 'config'
import oauth2 from 'simple-oauth2'
import fs from 'fs';
import moment from 'moment'

export default class  {
  constructor(options) {
    let self = this
    let defaults = {
      client: {
        id: config.pingasset.oauth2.client,
        secret: config.pingasset.oauth2.secret
      },
      auth: {
        tokenHost: config.pingasset.oauth2.endpoints.host,
        tokenPath: config.pingasset.oauth2.endpoints.token,
      }
    }

    this.config = Object.assign({}, defaults, options)
    try {
      this.client = oauth2.create(this.config)
    } catch (e) {
      console.log('Unable to create Oauth Client. Have you updated configuration with your keys?')
      process.exit(1);
    }

    // See if we have a saved token    
    this.token = null
  }

  /**
   * Fetch the config used.
   * @return {*}
   */
  getConfig () {
    return this.config;
  }

  getToken () {
    let self = this
    return new Promise((resolve, reject) => {
      let token = self.getSavedToken()
      if (token && self.isTokenExpired(token)) {
        resolve(token)
      } else {
        self.requestToken()
          .then((response) => {
            self.saveToken(response)
            resolve(response)
          })
          .catch((err) => {
            reject(err)
          })
      }
    })
  }

  requestToken () {
    let self = this;
    return new Promise(async (resolve, reject) => {
      try {
        let result = await self.client.clientCredentials.getToken({});
        let accessToken = self.client.accessToken.create(result);
        resolve(accessToken)
      } catch (e) {
        reject(e)
      }
    })
  }

  getSavedToken () {
    let token = null
    if (fs.existsSync('var/token.json')) {
      token = JSON.parse(fs.readFileSync('var/token.json'));
    }
    return token
  }

  saveToken (token) {
    fs.writeFileSync('var/token.json', JSON.stringify(token), (err) => {
      if (err) { console.log('Unable to save token.') }
      return true
    })
  }

  isTokenExpired (token) {
    if (token) {
      let tokenExpires = moment(token.token.expires_at)
      let now = moment()
      return now.isSameOrBefore(tokenExpires)
    } else {
      return false
    }
  }
}
