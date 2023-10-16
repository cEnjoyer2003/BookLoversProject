const { isModuleNamespaceObject } = require("util/types");
const { Quote, User } = require("../../schemas/schemas.js");

class QuoteProvider {
    async create(quoteText, username, body) {
        const oldQuote = await Quote.findOne({
            quoteText: quoteText,
            username: username,
          }).exec();

        console.log(oldQuote);
        if (oldQuote) return null;

        const quote = new Quote(body);

        try {
            const response = await quote.save();
            return response;
        } catch (error) {
            throw(error);
        }
    }

    async edit(oldText, newText, username, body) {
      
        const quote = await Quote.findOne({quoteText: newText, username: username}).exec();
        
        if (quote && newText!==oldText) return null;

        const updatedQuote = await Quote.findOne({quoteText: oldText, username: username}).exec();

        if(!updatedQuote) return null;

        let newFields = {};
        for (const [key, value] of Object.entries(body)) {
          if (value != updatedQuote[key] && value && updatedQuote[key]) {
            newFields[key] = value;
          }
        }

        const query = await Quote.updateOne(
            { quoteText: oldText, username: username },
            newFields
        ).exec();

        const editedQuote = await Quote.findOne({
            quoteText: newText,
            username: username,
        }).exec();
        
        if (editedQuote) {
          return editedQuote;
        } else {
          throw(new Error("server error"));
        }
    }

    async delete(quoteText, username, body) {
        const quote = await Quote.findOne({
            quoteText: quoteText,
            username: username,
          }).exec();

      if (!quote) return null;

      const query = await Quote.deleteOne({
        quoteText: quoteText,
        username: username,
      }).exec();
      
      if (query.deletedCount) {
        if(body.message.length !== 0) {
          const user = await User.findOne({'username': username}).exec();
          let prevMessages = user.messages ? user.messages : "";
          let newMessage = `Your quote with text "${quoteText}" was deleted by manager.\n${body.message}`;
          let messages = prevMessages + ";" + newMessage;
          const query = await User.updateOne({'username': username}, { $set: {'messages': messages}}, {strict: false} ).exec();
        }
        return query.deletedCount;
      } else {
        throw(new Error("server error"));
      }
    }
};

module.exports = new QuoteProvider();