const constantErrors = require('../constants/errors');
const userService = require('../services/user.service');

exports.userDetails = asyncWrapper(async (req, res) => {
    const data = await userService.getUserDetails({uid:req.uid});
    return res.json(data);
});