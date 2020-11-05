const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client([process.env.GOOGLE_ANDROID_CLIENT_ID, process.env.GOOGLE_IOS_CLIENT_ID]);

async function auth(req, res, next){
    try {
        if (!req.header('Authorization'))
            throw new Error('Acceso denegado')
        const token = req.header('Authorization').replace('Bearer ','');
        jwt.verify(token, process.env.JWT_SECRET_KEY);
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
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: [process.env.GOOGLE_ANDROID_CLIENT_ID, process.env.GOOGLE_IOS_CLIENT_ID]
        });
        const payload = ticket.getPayload();
        console.log({payload});
        const userid = payload['sub'];
        console.log({userid});
        return payload;
    } catch (error) {
        throw new Error('Acceso denegado')
    }
}

module.exports = {auth, generateTokenAuth, getUserFromRequest, verify};