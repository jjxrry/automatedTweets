import dotenv from 'dotenv';
import got from 'got';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import qs from 'querystring';
import rl from 'readline'
import express from 'express';
//@ts-expect-error
import cors from 'cors'
// load in tweet queue
import { processTweetQueue } from './tweetQueue.js';
import puppetAuth from './puppetAuth.js';

dotenv.config();

const app = express()
const corsOptions = {
    origin: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(express.json())

// keys here
const apiKey = process.env.APIKEY
const apiSecret = process.env.APISECRET
if (!apiKey || !apiSecret) {
    console.error('Environment variables are not loaded properly!');
}

//const readline = rl.createInterface({
//    input: process.stdin,
//    output: process.stdout
//})

const endpointURL = `https://api.twitter.com/2/tweets`

const requestTokenURL = 'https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write';
const authorizeURL = new URL('https://api.twitter.com/oauth/authorize');
const accessTokenURL = 'https://api.twitter.com/oauth/access_token';
const oauth = OAuth({
    consumer: {
        key: apiKey,
        secret: apiSecret
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
})

//async function input(prompt) {
//    return new Promise(async (resolve, reject) => {
//        readline.question(prompt, (out) => {
//            readline.close()
//            resolve(out)
//        })
//    })
//}

async function requestToken() {
    const authHeader = oauth.toHeader(oauth.authorize({
        url: requestTokenURL,
        method: 'POST'
    }));

    const req = await got.post(requestTokenURL, {
        headers: {
            Authorization: authHeader["Authorization"]
        }
    });
    if (req.body) {
        return qs.parse(req.body);
    } else {
        throw new Error('Cannot get an OAuth request token');
    }
}

async function accessToken({ oauth_token, oauth_token_secret }, verifier) {
    const authHeader = oauth.toHeader(oauth.authorize({
        url: accessTokenURL,
        method: 'POST'
    }))
    const path = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`
    const req = await got.post(path, {
        headers: {
            Authorization: authHeader["Authorization"]
        }
    })
    if (req.body) {
        return qs.parse(req.body)
    } else {
        throw new Error('cannot get an oauth request token')
    }
}

async function getRequest({ oauth_token, oauth_token_secret }, tweetData) {

    const token = {
        key: oauth_token,
        secret: oauth_token_secret
    };

    const authHeader = oauth.toHeader(oauth.authorize({
        url: endpointURL,
        method: 'POST'
    }, token));

    const req = await got.post(endpointURL, {
        json: tweetData,
        responseType: 'json',
        headers: {
            Authorization: authHeader["Authorization"],
            'user-agent': "v2CreateTweetJS",
            'content-type': "application/json",
            'accept': "application/json"
        }
    });
    if (req.body) {
        return req.body;
    } else {
        throw new Error('Unsuccessful request');
    }
}

//app.post('/api/write', async (req, res) => {
//    try {
//
//    } catch (e) {
//        console.error('Error Writing to Queue:', e);
//        res.status(500).json({ error: 'Error Writing to Queue' });
//    }
//})

app.post('/api/request', async (req, res) => {
    try {
        const oAuthRequestToken = await requestToken()
        authorizeURL.searchParams.append('oauth_token', oAuthRequestToken.oauth_token)
        res.json({ authorizationURL: authorizeURL.href })

    } catch (e) {
        console.error('Error generating authorization URL:', e);
        res.status(500).json({ error: 'Error generating authorization URL' });
    }
})

app.post('/api/submit', async (req, res) => {
    try {
        const { pin, oauth_token, oauth_token_secret, tweetData } = req.body
        const oAuthAccessToken = await accessToken({ oauth_token, oauth_token_secret }, pin.trim())

        const response = await processTweetQueue(oAuthAccessToken, async (token) => {
            return await getRequest(token, tweetData)
        })

        res.json(JSON.stringify(response))
    } catch (e) {
        console.error('Error generating authorization URL:', e);
        res.status(500).json({ error: 'Error submitting pin' });
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`port is up on port: ${PORT}`)
})

//(async () => {
//    try {
//        // Get request token
//        const oAuthRequestToken = await requestToken();
//        // Get authorization
//        authorizeURL.searchParams.append('oauth_token', oAuthRequestToken.oauth_token);
//        console.log('Please go here and authorize:', authorizeURL.href);
//
//        clipboardy.writeSync(authorizeURL.href)
//
//        //const pin = await puppetAuth(authorizeURL.href)
//        const pin = await input('Paste the PIN here: ');
//
//        // Get the access token
//        const oAuthAccessToken = await accessToken(oAuthRequestToken, pin.trim());
//        // Make the request
//        const response = await processTweetQueue(oAuthAccessToken, getRequest);
//        console.dir(response, {
//            depth: null
//        });
//    } catch (e) {
//        console.log(e);
//        process.exit(-1);
//    }
//    process.exit();
//})();>
