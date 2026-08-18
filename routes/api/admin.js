const express = require('express');
const router = express.Router();
const config = require('config');
const path = require('path');
const uuid = require('uuid/v4');

const server = require('../../server.js');

const Games = require('../../models/Games');
const GameHistory = require('../../models/GameHistory');
const Users = require('../../models/User');
const Categories = require('../../models/Categories');

// @route    POST api/admin/games/status-change
// @desc     Changing game status
// @access   Public

router.post('/games/status-change', async (req, res) => {
  console.log('api admin games status-change ');

  const humanId = req.body.game.humanId;
  const newStatus = req.body.newStatus;

  try {
    let game = null;

    if (!humanId) {
      return res.status(400).json({
        success: false,
        error: 'No game to update'
      });
    } else {
      game = await Games.findOneAndUpdate(
        { humanId: humanId },
        { status: newStatus },
        { upsert: false },
        null
      );
    }

    res.json({
      success: true,
      humanId,
      game,
      status: newStatus
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/admin/games/create
// @desc     Create new game
// @access   Public
router.post('/games/create', async (req, res) => {
  console.log('api admin games create');

  let updateFlag = false;

  if (!!req.body.humanId) {
    updateFlag = true;
  }

  let {
    humanId,
    marketPrice,
    currentPrice,
    status,
    durationType,
    duration,
    humanDuration,
    caption,
    description,
    link,
    timesClicked,
    discountType,
    discount,
    promocode,
    lastClick,
    category,
    timer
  } = req.body;

  if (req.body.duration && req.body.durationType) {
    const preDuration = req.body.duration;
    const untilDate = new Date(preDuration);
    duration = untilDate.getTime();

    if (req.body.durationType === 'endless') {
      duration = untilDate.getTime() + 864000000000;
    } else if (req.body.durationType === 'short') {
      duration = untilDate.getTime();
    }

    humanDuration = new Date(duration + 10800000);
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  if (!humanId) {
    humanId = getRandomInt(10000, 90000);
  }

  if (!marketPrice) {
    marketPrice = 0;
  }

  if (!currentPrice) {
    currentPrice = 0;
  }

  if (!timesClicked) {
    timesClicked = 0;
  }

  if (!category) {
    category = 'other';
  }

  if (!discountType) {
    discountType = 'gift';
  }

  if (!discount) {
    discount = 0;
  }

  if (!promocode) {
    promocode = '-';
  }

  if (!status) {
    status = 'holded';
  }

  if (!lastClick) {
    lastClick = Date.now();
  }

  if (!timer) {
    timer = 0;
  }

  if (!link) {
    link = '';
  }

  if (!durationType) {
    durationType = 'endless';
  }

  if (!duration) {
    duration = 0;
  }

  if (!humanDuration) {
    humanDuration = '';
  }

  try {
    let game = null;

    if (updateFlag) {
      game = await Games.findOneAndUpdate(
        { humanId: humanId },
        req.body,
        { upsert: false },
        null
      );
    } else {
      game = await Games.findOne({ humanId: humanId });
    }

    if (updateFlag && !game) {
      return res.status(400).json({
        success: false,
        error: 'No game to update'
      });
    }

    if (!updateFlag && game) {
      if (game) {
        return res.status(400).json({
          success: false,
          error: 'Game with this HumanId already exists'
        });
      }
    }

    if (!updateFlag) {
      game = new Games({
        humanId,
        marketPrice,
        currentPrice,
        status,
        durationType,
        duration,
        humanDuration,
        caption,
        description,
        link,
        timesClicked,
        discountType,
        discount,
        promocode,
        timer,
        category,
        lastClick
      });
    }

    if (Object.keys(req.files).length !== 0) {
      let bigPic = req.files.bigPic;
      const realName = bigPic.name;
      const guidName = uuid();
      const ext = path.extname(realName);

      game.bigPic = {
        guid: guidName,
        ext
      };

      bigPic.mv(`./upload/${guidName}${ext}`, function(err) {
        if (err) throw new Error(err);
      });
    }

    await game.save();

    res.json({ success: true, game: game });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/admin/games/create/:humanId
// @desc     Load game
// @access   Public
router.get('/games/create/:humanId', async (req, res) => {
  console.log('api admin games create :humanId GET');
  try {
    let humId = req.params.humanId;
    let game = await Games.findOne({ humanId: humId });

    if (!game) {
      return res.status(400).json({
        success: false,
        error: 'No game found'
      });
    }

    res.json({ success: true, loadedGame: game });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/admin/games/list
// @desc     Game list
// @access   Public
router.get('/games/list', async (req, res) => {
  console.log('api admin games list');
  try {
    let games = await Games.find();
    if (games.length < 1) {
      return res.status(400).json({
        success: false,
        error: 'No games in collection'
      });
    }

    res.json({ success: true, games: games });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/admin/users/list
// @desc     Users list
// @access   Public
router.get('/users/list', async (req, res) => {
  console.log('api admin users list');
  try {
    let users = await Users.find();
    if (users.length < 1) {
      return res.status(400).json({
        success: false,
        error: 'No users in collection'
      });
    }

    res.json({ success: true, users: users });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/admin/games/delete/:humanId
// @desc     Delete current game
// @access   Public
router.post('/games/delete/:humanId', async (req, res) => {
  console.log('api admin games delete');
  let humId = req.params.humanId;
  try {
    const gameInGames = await Games.findOneAndDelete({ humanId: humId });

    res.json({ success: true, deleted: humId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/admin/categories/create
// @desc     Create new category
// @access   Public
router.post('/categories/create', async (req, res) => {
  console.log('api admin categories create');

  let updateFlag = false;

  if (!!req.body.humanId) {
    updateFlag = true;
  }

  let { humanId, nameEng, nameRus, quantity } = req.body;

  console.log('req.body ', req.body);
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  if (!humanId) {
    humanId = getRandomInt(10000, 90000);
  }

  if (!nameEng) {
    nameEng = 'someCategory';
  }

  if (!nameRus) {
    nameRus = 'Какая-то категория';
  }

  if (!quantity) {
    quantity = 0;
  }

  try {
    let category = null;

    if (updateFlag) {
      category = await Categories.findOneAndUpdate(
        { humanId: humanId },
        req.body,
        { upsert: false },
        null
      );
    } else {
      category = await Categories.findOne({ humanId: humanId });
    }

    if (updateFlag && !category) {
      return res.status(400).json({
        success: false,
        error: 'No category to update'
      });
    }

    if (!updateFlag && category) {
      if (category) {
        return res.status(400).json({
          success: false,
          error: 'Category with this HumanId already exists'
        });
      }
    }

    if (!updateFlag) {
      category = new Categories({
        humanId,
        nameEng,
        nameRus,
        quantity
      });
    }

    if (Object.keys(req.files).length !== 0) {
      let bigPic = req.files.bigPic;
      const realName = bigPic.name;
      const guidName = uuid();
      const ext = path.extname(realName);

      category.bigPic = {
        guid: guidName,
        ext
      };

      bigPic.mv(`./upload/${guidName}${ext}`, function(err) {
        if (err) throw new Error(err);
      });
    }

    await category.save();

    res.json({ success: true, category });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/admin/categories/create/:humanId
// @desc     Load category
// @access   Public
router.get('/categories/create/:humanId', async (req, res) => {
  console.log('api admin categories create :humanId GET');
  try {
    let humId = req.params.humanId;
    let category = await Categories.findOne({ humanId: humId });

    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'No category found'
      });
    }

    res.json({ success: true, loadedCategory: category });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/admin/categories/list
// @desc     Category list
// @access   Public
router.get('/categories/list', async (req, res) => {
  console.log('api admin categories list');
  try {
    let categories = await Categories.find();

    if (categories.length < 1) {
      return res.status(400).json({
        success: false,
        error: 'No categories in collection'
      });
    }
    res.json({ success: true, categories: categories });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/admin/categories/delete/:humanId
// @desc     Delete current category
// @access   Public
router.post('/categories/delete/:humanId', async (req, res) => {
  console.log('api admin categories delete');
  let humId = req.params.humanId;
  try {
    const categoryInCategories = await Categories.findOneAndDelete({
      humanId: humId
    });

    res.json({ success: true, deleted: humId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
