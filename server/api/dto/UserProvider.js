const { isModuleNamespaceObject } = require("util/types");
const { Review, User, Top, Quote } = require("../../schemas/schemas.js");

class UserProvider {

    async edit(oldUsername, newUsername, body, hash) {
      
        const user = await User.findOne({ username: newUsername }).exec();
        
        if (user && oldUsername!==newUsername) return null;

        const updatedUser = await User.findOne({username: oldUsername}).exec();

        if(!updatedUser) return null;

        let newFields = {};
        for (const [key, value] of Object.entries(body)) {
          if (value != updatedUser[key] && value && updatedUser[key]) {
            newFields[key] = value;
          }
        }

        newFields.password = hash;

        const query = await User.updateOne(
            { username: oldUsername },
            newFields
          ).exec();

          const editedUser = await User.findOne({ username: newUsername }).exec();
        
        if (editedUser) {
          return editedUser;
        } else {
          throw(new Error("server error"));
        }
    }

    async get(username) {
        const user = await User.findOne({ username: username }).exec();

        if(!user) return null;

        const reviews = await Review.find({ username: username }).exec();
        const tops = await Top.find({ username: username }).exec();
        const quotes = await Quote.find({ username: username }).exec();

        if(user) {
            return {user, reviews, tops, quotes};
        } else {
            throw(new Error("server error"));
        }
        
    }

    async editRole(username, body) {
        const user = await User.findOne({ 'username' : username}).exec();

        if(!user) return null;

        let prevMessages = user.messages ? user.messages : "";
        let messages = prevMessages + ";" + body.message;
        const query = await User.updateOne(
            { 'username': username }, 
            { $set: { 'messages': messages, 'role': body.role } }, 
            { strict: false }
        ).exec();

        if(query.modifiedCount) {
            return query.modifiedCount;
        } else {
            throw(new Error("server error"));
        }
    }

    async deleteMessages(username) {
        const user = await User.findOne({ 'username' : username}).exec();

        if(!user) return null;

        const query = await User.updateOne({ 'username': username }, { $set: { 'messages': "" } }, { strict: false }).exec();

        if(query.modifiedCount) {
            return query.modifiedCount;
        } else {
            throw(new Error("server error"));
        }
    }

    async delete(username, body) {
        const user = await User.findOne({ 'username' : username}).exec();
        if(!user) return null;

        let message = `Your account was deleted by admin.\n${body.message}`;
        const query = await User.updateOne({'username' : username}, { $set: {'deleteMessage': message}}, {strict: false}).exec();

        if(query.modifiedCount) {
            return query.modifiedCount;
        } else {
            throw(new Error("server error"));
        }
    }

    async deleteUserData(username) {
        const user = await User.findOne({ 'username' : username}).exec();
        if(!user) return null;

        const deleteUser = await User.deleteOne({'username' : username}).exec();
        const deleteQuotes = await Quote.deleteMany({'username' : username}).exec();
        const deleteTops = await Top.deleteMany({'username' : username}).exec();
        const deleteReviews = await Review.deleteMany({'username' : username}).exec();

        if(deleteUser.deletedCount && deleteQuotes.acknowledged && deleteTops.acknowledged && deleteReviews.acknowledged) {
            return deleteUser.deletedCount;
        } else {
            throw(new Error("server error"));
        }
    }
};

module.exports = new UserProvider();