import express from 'express';
import rp from 'request-promise-native'
import OauthClient from '../OauthClient'
let oauth = new OauthClient()
let router = express.Router();

// OAuth Token Middleware. Ensures there is a valid token available in the request obj
// so you can use it elsewhere. 
let getToken = (req, res, next) => {
    oauth.getToken()
    .then((tknResp) => {
        req.ping = {token: null}
        req.ping.token = tknResp.token.access_token
        next()
    })
    .catch((err) => {
        next(new Error('Unable to obtain valid API token.'))
    })
}

// If you want to use the get token middleware on all requests uncomment below.
// router.use(getToken)

let getDeviceEvents = (token, imei, page_size=100) => {
    return rp({
        url: `https://api.pingasset.com/1.0/events/?imei=${imei}&page_size=${page_size}`,
        headers: {
            Authorization: 'Bearer ' + token
        },
        json: true
    })
}

// Routes
router.get('/', (req, res, next) => {
    res.json({track: true})
})

/**
 * Note that this route uses the getToken middleware to ensure there is a 
 * valid request token.
 */
router.get('/:id', getToken, (req, res, next) => {
    getDeviceEvents(req.ping.token, req.params.id)
    .then((response) => {
        res.render('tracking', {
            imei: req.params.id,
            result: response
        })
    })
    .catch((err) => {
        next(err)
    })
})

export default router;