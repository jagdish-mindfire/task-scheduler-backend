const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const sessionHelper = require('../utils/session');
const constantStrings = require('../constants/strings');

const privateKey = process.env.JWT_PRIVATE_KEY;

const  decode = (accessToken) => {
    try {
        const decoded = jwt.verify(accessToken, privateKey);
        return decoded;
    } catch (err) {
        return false;
    }
}

const authMiddleware = async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        const result = decode(bearerToken);
        if (result) {
            const sessionId = result.session_id;
            const sessionValidity = await sessionHelper.checkSessionValidity(sessionId);
            if(sessionValidity){
                req.uid = result.uid;
                next();
            }else{
                res.status(401).json({
                    'error': constantStrings.SESSION_EXPIRED
                });
                return;
            }
        } else {
            res.status(401).json({
                'error': constantStrings.UNAUTHORIZED_ACCESS
            });
        }
    } else {
        res.status(401).json({
            'error': constantStrings.UNAUTHORIZED_ACCESS
        });
    }

};
module.exports = {authMiddleware,decode};