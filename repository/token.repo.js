const constantStrings = require("../constants/strings");
const taskModel = require("../model/token.model");

exports.getTokenData = async ({refreshToken}) => {
    return await taskModel.findOne({refreshToken});
};

exports.getAllTokens = async ({uid}) => {
    return await taskModel.find({uid});;
};

exports.deleteTokens = async ({refreshToken,uid}) => {
    if(refreshToken){
        return await taskModel.deleteOne({refreshToken});
    }else if(uid){
        return await taskModel.deleteMany({uid});
    }else{
        throw new Error(constantStrings.INVALID_REQUEST);
    }
};