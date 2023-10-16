const express = require("express");
const router = express.Router();
const searchDTO = require("../dto/SearchProvider");

router.use("/search", async (request, response) => {
    try {
      const results = await searchDTO.search(request.body.request, request.body.filter);
    if (!results) {
      response.send({ status: 404 });
      return;
    } 
      console.log(results);
      response.send({ status: 200, items: [...results] });
    } catch (error) {
      console.log(error);
      response.status(500).send(error);
    }
  });
  

module.exports = router;