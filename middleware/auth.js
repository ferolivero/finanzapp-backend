const jwt = require('jsonwebtoken');
const dataUser = require('../data/user');
const dotenv = require('dotenv').config();
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(['965440611676-l44ls589vsp17lf9nnok70rgbmcndjhn.apps.googleusercontent.com', '965440611676-st0f6b7mpuc25k6afr2ha1eq8k6oabf0.apps.googleusercontent.com']);

async function auth(req, res, next){
    try {
        if (!req.header('Authorization'))
            throw new Error('Acceso denegado')
        const token = req.header('Authorization').replace('Bearer ','');
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        //const user = await dataUser.getUsuario(decoded._id);
        //req.headers['user'] = user._id;
        next();
    } catch (e) {
        res.status(401).send({error: e.message});
    }
}

async function generateTokenAuth(user){
    const token = jwt.sign(user, process.env.JWT_SECRET_KEY); //, {expiresIn: '1h'}
    return token;
}

function getUserFromRequest(req) {
    return req.headers['user'];
}

async function verify(token) {
    console.log({token});
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: ['965440611676-l44ls589vsp17lf9nnok70rgbmcndjhn.apps.googleusercontent.com', '965440611676-st0f6b7mpuc25k6afr2ha1eq8k6oabf0.apps.googleusercontent.com'],  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    console.log({payload});
    const userid = payload['sub'];

    console.log({userid});
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    return payload;
}

module.exports = {auth, generateTokenAuth, getUserFromRequest, verify};