const { isModuleNamespaceObject } = require("util/types");
const {User} = require("../../schemas/schemas.js");

class PasswordProvider {

    async setCode(email, hash, codeExpire) {
        const user = await User.findOne({ email: email }).exec();
        if (!user) return null;

        const query = await User.updateOne(
            { email: user.email },
            { $set: { code: hash, codeExpire } },
            { strict: false }
          ).exec();

        const updatedUser = await User.findOne({ email: email }).exec();

        if(query.modifiedCount) {
            return updatedUser;
        } else {
            throw(new Error("server error"));
        }
    }

    async confirmCode(email) {
        const user = await User.findOne({ email: email }).exec();
        if (!user) return null;

        if(user) {
            return user;
        } else {
            throw(new Error("server error"));
        }
    }

    async resetPwd(email, hash) {
        const user = await User.findOne({ email: email }).exec();
        if (!user) return null;

        const query = await User.updateOne(
            { email: user.email },
            { password: hash }
          ).exec();
        
        const updatedUser = await User.findOne({
            email: email,
          }).exec();

        if(query.modifiedCount && updatedUser) {
            return updatedUser;
        } else {
            throw(new Error("server error"));
        }
    }
};

module.exports = new PasswordProvider();