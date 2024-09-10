const bcrypt = require('bcrypt');

const encryptePassword = (password) => {
    // Generate a salt
    const saltRounds = 11;
    const salt = bcrypt.genSaltSync(saltRounds);
    // Hash the password with the salt
    const hashPassword = bcrypt.hashSync(password, salt);
    return hashPassword;
};

module.exports = {encryptePassword};