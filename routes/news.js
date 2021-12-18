const express = require('express');
const router = express.Router();
const getnewsController = require("../controller/news");


router.get('/', getnewsController.getNews);
router.get('/viewall', getnewsController.getviewAll);


module.exports= router;