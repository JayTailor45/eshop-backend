const {expressjwt: jwt} = require('express-jwt');

function authJwt() {
    const apiPrefix = process.env.API_PREFIX;
    return jwt({
        secret: process.env.JWT_SECRET,
        algorithms: ['HS256'],
        isRevoked: isRevoked,
    }).unless({
        path: [
            `${apiPrefix}/v1/users/login`,
            `${apiPrefix}v1/users/register`,
            {
                url: /\/api\/v1\/products(.*)/,
                methods: ['GET', 'OPTIONS']
            },
            {
                url: /\/api\/v1\/categories(.*)/,
                methods: ['GET', 'OPTIONS']
            }
        ]
    });
}

async function isRevoked(req, payload, done) {
    if(!payload.isAdmin) {
        return false
    }
    return true
}

module.exports = authJwt;