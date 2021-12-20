const express = require('express');
const router = express.Router();
const getnewsController = require("../controller/news");


router.get('/', getnewsController.getNews);
router.get('/latest_news/:id', getnewsController.getspecificNews);
router.get('/viewall', getnewsController.getviewAll);
router.get('/categories/:id', getnewsController.getviewAllById);
router.post('/search', getnewsController.searchnews);
router.get('/explore-latest', getnewsController.explorelatest);
router.get('/explore-random', getnewsController.exploreRandom);
router.get('/submit-news', getnewsController.submitnews);
router.post('/submit-news', getnewsController.submitnewsonpost);





module.exports= router;