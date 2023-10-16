const { isModuleNamespaceObject } = require("util/types");
const { Review, User, Top, Quote } = require("../../schemas/schemas.js");

class AuthProvider {

    async signIn(username){
        const user = await User.findOne({
            $or: [
                { 'username': username },
                { 'email': username }
            ]
        }).exec();

        if (!user) return null;

        const reviews = await Review.find({ 'username': user.username }).exec();
        const tops = await Top.find({ 'username': user.username }).exec();
        const quotes = await Quote.find({ 'username': user.username }).exec();

        if(user) {
            return {user, reviews, tops, quotes};
        } else {
            throw(new Error("server error"));
        }
    }

    async register(body, hash){
        const usernameExists = await User.findOne({ 'username' : body.username}).exec();
        if(usernameExists) return 0;
        const emailExists = await User.findOne({ 'email' : body.email}).exec();
        if(emailExists) return 1;

        let userObj = body;
        userObj.role = "valid-user";
        userObj.password = hash;
        const user = new User(userObj);

        try {
            await user.save();
            return user;
        } catch (error) {
            throw(error);
        }
    }
};

module.exports = new AuthProvider();