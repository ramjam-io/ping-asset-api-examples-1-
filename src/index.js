import config from 'config'
import OauthClient from './OauthClient'
let client = new OauthClient()
client.getToken()
  .then((token) => {
    console.log(token)
  })
