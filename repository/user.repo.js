const constantStrings = require("../constants/strings");
const userModel = require("../model/user.model")

exports.findUser = async ({email}) => {
    return await userModel.findOne({email});
};

exports.createUser = async ({email,name,password}) => {
    await userModel.create({email,name,password});
};