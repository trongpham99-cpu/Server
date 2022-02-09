const JWT = require('jsonwebtoken');
const createError = require('http-errors');

const signAccessToken = async (userId) => {
    return new Promise( (resolve, reject) => {
        const payload = {
            userId
        }
        const options = {
            expiresIn: '1h'
        }

        JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, options, (err, token) => {
            if(err) reject(err)
            resolve(token)
        })
    })
}

const verifyAccessToken = (req, res, next) => {
    if(!req.headers['authorization']){
        return next(createError.Unauthorized());
    }
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err){
            return next(createError.Unauthorized());
        }
        req.payload = payload;
        next();
    })
}

module.exports = {
    signAccessToken,
    verifyAccessToken
}