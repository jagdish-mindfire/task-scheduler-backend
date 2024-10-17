const jwt = require('jsonwebtoken');
const sessionHelper = require('../utils/session');
const constantStrings = require('../constants/strings');
const { APIError } = require('../utils/custom-errors');
const constantErrors = require('../constants/errors');

const privateKey = process.env.JWT_PRIVATE_KEY;

const  decode = (accessToken) => {
    try {
        const decoded = jwt.verify(accessToken, privateKey);
        return decoded;
    } catch (err) {
        return false;
    }
}

const authMiddleware = asyncWrapper(async (req, res, next) => {
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
                throw new APIError(constantErrors.SESSION_EXPIRED);
            }
        } else {
            throw new APIError(constantErrors.UNAUTHORIZED_ACCESS);
        }
    } else {
        throw new APIError(constantErrors.UNAUTHORIZED_ACCESS);
    }

});
module.exports = {authMiddleware,decode};