const CONSTANT_STRINGS = require("../constants/strings.json");
const UserModel = require("../model/user")

exports.findUser = async ({email}) => {
    return await UserModel.findOne({ email});
};

exports.createUser = async ({email,name,password}) => {
    await UserModel.create({email,name,password});
};