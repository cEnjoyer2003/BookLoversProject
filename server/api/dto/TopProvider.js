const { isModuleNamespaceObject } = require("util/types");
const { Top, User } = require("../../schemas/schemas.js");

class TopProvider {
    async create(title, username, body) {
        const oldTop = await Top.findOne({title: title, username: username}).exec();
        console.log(oldTop);
        if (oldTop) return null;
        const top = new Top(body);

        try {
            const response = await top.save();
            return response;
        } catch (error) {
            throw(error);
        }
    }

    async edit(oldTitle, newTitle, username, body) {
      
        const top = await Top.findOne({title: newTitle, username: username}).exec();
        
        if (top && newTitle!==oldTitle) return null;

        const updatedTop = await Top.findOne({title: oldTitle, username: username}).exec();

        if(!updatedTop) return null;

        let newFields = {};
        for (const [key, value] of Object.entries(body)) {
          if (value != updatedTop[key] && value && updatedTop[key]) {
            newFields[key] = value;
          }
        }
        newFields.books = body.books;

        const query = await Top.updateOne(
          { title: oldTitle, username: username },
          newFields
        ).exec();

        const editedTop = await Top.findOne({
          title: newTitle,
          username: username,
        }).exec();
        
        if (editedTop) {
          return editedTop;
        } else {
          throw(new Error("server error"));
        }
    }

    async delete(title, username, body) {
      const top = await Top.findOne({
        title: title,
        username: username,
      }).exec();

      if (!top) return null;

      const query = await Top.deleteOne({
        title: title,
        username: username,
      }).exec();

      if (query.deletedCount) {
        if(body.message.length !== 0) {
          const user = await User.findOne({'username': username}).exec();
          let prevMessages = user.messages ? user.messages : "";
          let newMessage = `Your top with title "${title}" was deleted by manager.\n${body.message}`;
          let messages = prevMessages + ";" + newMessage;
          const query = await User.updateOne({'username': username}, { $set: {'messages': messages}}, {strict: false} ).exec();
        }
        return query.deletedCount;
      } else {
        throw(new Error("server error"));
      }
    }
};

module.exports = new TopProvider();