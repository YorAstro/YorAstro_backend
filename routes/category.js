const express = require("express");
const { CategoryList } = require("../controllers/categories.js");
const router = express.Router();

router.get('/', CategoryList);

module.exports =  router;