const express = require('express');
const router = express.Router();
const config = require('config');

const Games = require('../../models/Games');

// @route    GET api/playground
// @desc     Game list for playground
// @access   Public
router.get('/', async (req, res) => {
  try {
    const currentDate = Date.now();

    let games = await Games.find({ duration: { $gte: currentDate } });

    if (games.length < 1) {
      console.log('no games in collection');
      // return res.status(400).json({
      //   success: false,
      //   error: 'No games in collection'
      // });
    }

    res.json({ success: true, playground: games });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/playground/contribute
// @desc     Contributing a game
// @access   Public

router.post('/contribute', async (req, res) => {
  console.log('api playground contribute ');
  const { singleGame, user } = req.body;

  try {
    const chosenGame = await Games.findById(singleGame);
    const newTimesClicked = chosenGame.timesClicked + 1;

    if (chosenGame.status == 'opened') {
      await Games.updateOne(
        { _id: singleGame },
        {
          timesClicked: newTimesClicked
        }
      );

      const updatedGame = await Games.findById(singleGame);

      res.json({
        success: true,
        updatedGame
      });
    } else {
      res.json({ success: false, updatedGame });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/filter', async (req, res) => {
  console.log('api playground filter ');
  let categories = req.body.categories;

  categories = Object.keys(categories);

  const allCategories = await Categories.find();

  const query = [];

  allCategories.forEach(category => {
    for (var i = 0; i < categories.length; i++) {
      if (category.nameEng === categories[i]) {
        query.push(category.nameEng);
      }
    }
  });

  try {
    const filteredGames = await Games.find({
      category: { $in: query }
    });

    if (filteredGames.length > 0) {
      res.json({
        success: true,
        filteredGames
      });
    } else {
      res.json({ success: false, filteredGames });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
