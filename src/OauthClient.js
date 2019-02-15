import config from 'config'
import oauth2 from 'simple-oauth2'

export default class  {
  constructor(options) {
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
    this.client = oauth2.create(this.config)
  }

  /**
   * Fetch the config used.
   * @return {*}
   */
  getConfig () {
    return this.config;
  }


  getToken () {
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
  saveToken () {}
  useToken () {}
}
