import config from 'config'
import OauthClient from './OauthClient'
import app from './app'

// Start the service with a token.
let client = new OauthClient()


app.listen(config.port, function () {
    console.log(config.name + ' (v' + config.version + ') started on port: 3000')
});