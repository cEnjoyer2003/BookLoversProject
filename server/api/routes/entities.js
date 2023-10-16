const express = require("express");
const router = express.Router();
const reviewDTO = require("../dto/ReviewProvider");
const topDTO = require("../dto/TopProvider");
const quoteDTO = require("../dto/QuoteProvider");

router.post("/new-review", async (request, response) => {
  try {
    const review = await reviewDTO.create(request.body.title, request.body.username, request.body);
    if (!review) {
        response.send({ status: 400 }); 
        return;
    };
    console.log(review);
    response.send({ status: 200 });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

router.use("/edit-review", async (request, response) => {
      try {
        const review = await reviewDTO.edit(request.body.reviewTitle, request.body.title, request.body.username, request.body);
        if(review === 0) {
          response.send({ status: 404 }); 
          return;
        }
        if (!review) {
            response.send({ status: 400 }); 
            return;
        };
        console.log(review);
        response.send({ status: 200 });
      } catch (error) {
        console.log(error);
        response.status(500).send(error);
      }
});

router.use("/delete-review", async (request, response) => {
  try {
    const review = await reviewDTO.delete(request.body.reviewTitle, request.body.username, request.body);
    if (!review) {
        response.send({ status: 404 }); 
        return;
    };
    console.log(review);
    response.send({ status: 200 });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

router.use("/new-top", async (request, response) => {
  try {
    const top = await topDTO.create(request.body.title, request.body.username, request.body);
    if (!top) {
        response.send({ status: 400 }); 
        return;
    };
    console.log(top);
    response.send({ status: 200 });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

router.use("/edit-top", async (request, response) => {
  try {
    const top = await topDTO.edit(request.body.oldTitle, request.body.title, request.body.username, request.body);
    if (!top) {
        response.send({ status: 400 }); 
        return;
    };
    console.log(top);
    response.send({ status: 200 });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

router.use("/delete-top", async (request, response) => {
  try {
    const top = await topDTO.delete(request.body.topTitle, request.body.username, request.body);
    if (!top) {
        response.send({ status: 404 }); 
        return;
    };
    console.log(top);
    response.send({ status: 200 });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

router.use("/new-quote", async (request, response) => {
  try {
    const quote = await quoteDTO.create(request.body.quoteText, request.body.username, request.body);
    if (!quote) {
        response.send({ status: 400 }); 
        return;
    };
    console.log(quote);
    response.send({ status: 200 });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

router.use("/edit-quote", async (request, response) => {
  try {
    const quote = await quoteDTO.edit(request.body.text, request.body.quoteText, request.body.username, request.body);
    if (!quote) {
        response.send({ status: 400 }); 
        return;
    };
    console.log(quote);
    response.send({ status: 200 });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

router.use("/delete-quote", async (request, response) => {
  try {
    const quote = await quoteDTO.delete(request.body.quoteText, request.body.username, request.body);
    if (!quote) {
        response.send({ status: 404 }); 
        return;
    };
    console.log(quote);
    response.send({ status: 200 });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

module.exports = router;