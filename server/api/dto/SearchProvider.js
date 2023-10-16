const { isModuleNamespaceObject } = require("util/types");
const { Review, User, Top, Quote } = require("../../schemas/schemas.js");

class SearchProvider {
    async search(request, filter) {
    let str = request.toLowerCase();
    let regex = new RegExp(str, "gi");
    let items = [];
    switch (true) {
      case str.startsWith("top"): {
        items = await Top.find({ title: regex }).exec();
        break;
      }
      case (str.includes("review")): {
        let reviewRegex = new RegExp(str.slice(6, str.length), "gi");
        if (filter && Object.keys(filter)) {
          let gte = filter.from;
          let lte = filter.to;
          if (str === "review") {
            items = await Review.find().exec();
          } else {
            items = await Review.find({ title: reviewRegex }).exec();
          }
          items = await Review.find({
            title: reviewRegex,
            rank: { $lte: lte, $gte: gte },
          }).exec();
        } else {
          if (str === "review") {
            items = await Review.find().exec();
          } else {
            items = await Review.find({ title: reviewRegex }).exec();
          }
        }
        break;
      }
      case (str.includes("quote")): {
        if (str === "quote") {
          items = await Quote.find().exec();
        } else {
          let quoteRegex = new RegExp(str.slice(5, str.length), "gi");
          let byText = await Quote.find({ quoteText: quoteRegex }).exec();
          let byAuthor = await Quote.find({ author: quoteRegex }).exec();
          items.push(...byText, ...byAuthor);
        }
        break;
      }
      case (str === "user"): {
        let users = await User.find({}).exec();
        items.push(...users);
        break;
      }
      default: {
        let byUsername = await User.find({ username: regex }).exec();
        let byName = await User.find({ name: regex }).exec();
        let bySurname = await User.find({ surname: regex }).exec();
        let quoteByText = await Quote.find({ quoteText: regex }).exec();
        let quoteByAuthor = await Quote.find({ author: regex }).exec();
        let reviewByTitle = await Review.find({ title: regex }).exec();
        let reviewByAuthor = await Review.find({ author: regex }).exec();
        let reviewByGenre = await Review.find({ genresString: regex }).exec();
        let reviewByText = await Review.find({ reviewText: regex }).exec();
        let topByTitle = await Top.find({ title: regex }).exec();
        let topByAuthor = await Top.find({ author: regex }).exec();
        let topByGenre = await Top.find({ genresString: regex }).exec();
        items.push(
          ...byUsername,
          ...byName,
          ...bySurname,
          ...quoteByText,
          ...quoteByAuthor,
          ...reviewByTitle,
          ...reviewByAuthor,
          ...reviewByGenre,
          ...reviewByText,
          ...topByTitle,
          ...topByAuthor,
          ...topByGenre
        );
        break;
      }
    }
    items = items.filter((item) => JSON.stringify(item) !== "{}" && (!item.deleteMessage));
    const setArr = new Set(items);
    if (setArr.size === 0) return null;
    if(setArr) {
        return setArr;
    } else {
        throw(new Error("server error"));
    }
    }
};

module.exports = new SearchProvider();