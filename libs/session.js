const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function generateSessionId() {
    const response = { status: true };
    try {
        const sessionId = crypto.randomBytes(12).toString('hex') + new Date().getTime();
        const sessionDir = path.join(__dirname, '../config/sessions');
        const sessionFilePath = path.join(sessionDir, sessionId);
        if (!fs.existsSync(sessionDir)){
          fs.mkdirSync(sessionDir);
        }
        const fd = fs.openSync(sessionFilePath, 'w'); // Open the file
        fs.closeSync(fd); // Close the file descriptor after opening
        response.sessionId = sessionId;
    } catch (error) {
        console.log(error);
        response.status = false;
    }
    return response;
}

async function deleteSessionId(sessionId) {
    try {
        const filePath = path.join(__dirname, `../config/sessions`, sessionId);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        return true;
    } catch (error) {
        console.log(error);
       return false;
    }
}

function checkSessionValidity(sessionId){

    try {
        const filePath = path.join(__dirname, `../config/sessions/${sessionId}`);
        const stats = fs.statSync(filePath) // create meta data object of file or fetch file details
        if (!stats) {
            return false;
        }
        
        const tokenExpiryDays = process.env.REFRESH_TOKEN_EXPIRY;

        const now = new Date();
        const modifiedTime = new Date(stats.birthtime);

        const diffInMs = now - modifiedTime;

        // Convert milliseconds to days
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        if (diffInDays >= tokenExpiryDays) {
            // Token has expired
            return false;
        }
        else {
            return true;
        }
    } catch (error) {
        return false;
    }
}
module.exports = { generateSessionId, deleteSessionId,checkSessionValidity }
