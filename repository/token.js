const CONSTANT_STRINGS = require("../constants/strings.json");
const UserModel = require("../model/user")
const TokenModel = require("../model/token");

exports.getTokenData = async ({refreshToken}) => {
    return await TokenModel.findOne({refreshToken});
};

exports.getAllTokens = async ({uid}) => {
    return await TokenModel.find({uid});;
};

exports.deleteTokens = async ({refreshToken,uid}) => {
    if(refreshToken){
        return await TokenModel.deleteOne({refreshToken});
    }else if(uid){
        return await TokenModel.deleteMany({uid});
    }else{
        throw new Error(CONSTANT_STRINGS.INVALID_REQUEST);
    }
};