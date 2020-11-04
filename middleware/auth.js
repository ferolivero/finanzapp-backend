const jwt = require('jsonwebtoken');
const dataUser = require('../data/user');
const dotenv = require('dotenv').config();

async function auth(req, res, next){
    try {
        if (!req.header('Authorization'))
            throw new Error('Acceso denegado')
        const token = req.header('Authorization').replace('Bearer ','');
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await dataUser.getUsuario(decoded._id);
        req.headers['user'] = user._id;
        next();
    } catch (e) {
        res.status(401).send({error: e.message});
    }
}

async function generateTokenAuth(user){
    const token = jwt.sign(user, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
    return token;
}

function getUserFromRequest(req) {
    return req.headers['user'];
}

module.exports = {auth, generateTokenAuth, getUserFromRequest};