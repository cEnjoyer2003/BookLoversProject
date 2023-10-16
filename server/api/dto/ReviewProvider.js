const { isModuleNamespaceObject } = require("util/types");
const { Review, User } = require("../../schemas/schemas.js");

class ReviewProvider {
    async create(title, username, body) {
        const oldReview = await Review.findOne({title: title, username: username}).exec();
        console.log(oldReview);
        if (oldReview) return null;
        const review = new Review(body);

        try {
            const response = await review.save();
            return response;
        } catch (error) {
            throw(error);
        }
    }

    async edit(oldTitle, newTitle, username, body) {
      
        const review = await Review.findOne({title: newTitle, username: username}).exec();
        
        if (review && newTitle!==oldTitle) return null;

        const updatedReview = await Review.findOne({title: oldTitle, username: username}).exec();

        if(!updatedReview) return 0;

        let newFields = {};
        for (const [key, value] of Object.entries(body)) {
          if (value != updatedReview[key] && value && updatedReview[key]) {
            newFields[key] = value;
          }
        }

        const query = await Review.updateOne(
          { title: oldTitle, username: username },
          newFields
        ).exec();
        
        if (query.modifiedCount) {
          return query.modifiedCount;
        } else {
          throw(new Error("server error"));
        }
    }

    async delete(title, username, body) {
      const rev = await Review.findOne({
        title: title,
        username: username,
      }).exec();

      if (!rev) return null;

      const query = await Review.deleteOne({
        title: title,
        username: username,
      }).exec();
      
      if (query.deletedCount) {
        if(body.message.length !== 0) {
          const user = await User.findOne({'username': username}).exec();
          let prevMessages = user.messages ? user.messages : "";
          let newMessage = `Your review with title "${title}" was deleted by manager.\n${body.message}`;
          let messages = prevMessages + ";" + newMessage;
          const query = await User.updateOne({'username': username}, { $set: {'messages': messages}}, {strict: false} ).exec();
        }
        return query.deletedCount;
      } else {
        throw(new Error("server error"));
      }
    }
};

module.exports = new ReviewProvider();