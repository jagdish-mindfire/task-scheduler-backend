const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const sessionHelper = require('../libs/session');
const CONSTANT_STRINGS = require('../constants/strings.json');

const privateKey = process.env.JWT_PRIVATE_KEY;

const  Decode = (accessToken) => {
    try {
        const decoded = jwt.verify(accessToken, privateKey);
        return decoded;
    } catch (err) {
        return false;
    }
}

const TokenMiddleware = async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        const result = Decode(bearerToken);
        if (result) {
            const sessionId = result.session_id;
            const sessionValidity = await sessionHelper.checkSessionValidity(sessionId);
            if(sessionValidity){
                req.uid = result.uid;
                next();
            }else{
                res.status(401).json({
                    'error': CONSTANT_STRINGS.SESSION_EXPIRED
                });
                return;
            }
        } else {
            res.status(401).json({
                'error': CONSTANT_STRINGS.UNAUTHORIZED_ACCESS
            });
        }
    } else {
        res.status(401).json({
            'error': CONSTANT_STRINGS.UNAUTHORIZED_ACCESS
        });
    }

};
module.exports = {TokenMiddleware,Decode};