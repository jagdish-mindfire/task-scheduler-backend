const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const sessionHelper = require('../libs/session');

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
            const sessionValidity = sessionHelper.checkSessionValidity(sessionId);
            if(sessionValidity){
                req.uid = result.uid;
                next();
            }else{
                res.status(401).json({
                    'error': "sessoin is expired."
                });
                return;
            }
        } else {
            res.status(401).json({
                'error': "Unauthorized access."
            });
        }
    } else {
        res.status(401).json({
            'error': "Unauthorized access."
        });
    }

};
module.exports = {TokenMiddleware,Decode};