const crypto = require('crypto');
const constantStrings = require('../constants/strings');

const redisClient = require('../config/redis');


async function generateSessionId() {

    const response = { status: true };
    try {
        const sessionId = crypto.randomBytes(12).toString('hex') + new Date().getTime();
        await redisClient.set(`${constantStrings.SESSION_PREFIX}:${sessionId}`, 1, {
            EX: process.env.REFRESH_TOKEN_EXPIRY * 24 *60 *60 
        });
        response.sessionId = sessionId;
    } catch (error) {
        console.log(error);
        response.status = false;
    }
    return response;
}

async function deleteSessionId(sessionId) {
    try {
        redisClient.del(`${constantStrings.SESSION_PREFIX}:${sessionId}`);
        return true;
    } catch (error) {
        console.log(error);
       return false;
    }
}

async function checkSessionValidity(sessionId){
    try {
        const isValid = await redisClient.get(`${constantStrings.SESSION_PREFIX}:${sessionId}`);
        if (isValid) {
            return true;
        }
        else {
            return false;
        }
    } catch (error) {
        return false;
    }
}
module.exports = { generateSessionId, deleteSessionId,checkSessionValidity }
