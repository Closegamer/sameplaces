const express = require('express');
const router = express.Router();
const config = require('config');
const path = require('path');
const uuid = require('uuid/v4');

const server = require('../../server.js');

const Games = require('../../models/Games');
const GameHistory = require('../../models/GameHistory');
const Users = require('../../models/User');
const AutoBetting = require('../../models/AutoBetting');

// @route    POST api/admin/games/status-change
// @desc     Changing game status
// @access   Public

router.post('/games/setAutobetting', async (req, res) => {
  console.log('api admin games setAutobetting ');

  const game = req.body.game;
  const user = req.body.user;
  const position = req.body.position;

  console.log('autobetting switched on: ', game.humanId, user.nick, position);
  try {
    let newRecord = null;

    if (!game) {
      return res.status(400).json({
        success: false,
        error: 'No game to update'
      });
    } else {
      const isRecord = await AutoBetting.findOne({
        user,
        game
      });

      if (isRecord && position == false) {
        console.log('here');
        await AutoBetting.findOneAndDelete({
          user,
          game
        });
      }

      function getRandomArbitary(min, max) {
        return Math.random() * (max - min) + min;
      }

      let clickTime = Math.round(getRandomArbitary(2, 9));

      if (position) {
        newRecord = new AutoBetting({
          user,
          game,
          clickTime
        });

        await newRecord.save();
      }
    }

    // autoexec(null, null, null);

    res.json({
      success: true,
      humanId: game.humanId,
      position
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

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

// @route    POST api/admin/games/reactor-switch
// @desc     Changing game reactor state
// @access   Public

router.post('/games/reactor-switch', async (req, res) => {
  console.log('api admin games reactor-switch ');

  const game = req.body.game;
  // const humanId = req.body.humanId;
  const reactorSwitch = req.body.reactorSwitch;
  console.log('reactor position: ', reactorSwitch);
  console.log('reactor game: ', game);
  console.log('reactor position: ', reactorSwitch);
  // const status = req.body.status;

  try {
    let gameToReactor = null;

    if (!game) {
      return res.status(400).json({
        success: false,
        error: 'No game to update'
      });
    } else {
      gameToReactor = await Games.findOneAndUpdate(
        { humanId: game.humanId },
        { reactor: reactorSwitch },
        { upsert: false },
        null
      );

      // реактор здесь

      const gameToReactorOn = game._id;
      const stuff = await Users.find({
        stuff: 'yes'
      });

      if (reactorSwitch == 'on' && stuff.length > 0) {
        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let newRecord = null;

        stuff.forEach(async person => {
          const isRecord = await AutoBetting.findOne({
            user: person.id,
            game: gameToReactorOn
          });

          if (isRecord) {
            await AutoBetting.findOneAndDelete({
              user: person.id,
              game: gameToReactorOn
            });
          }

          let clickTime = getRandomInt(2, 13);
          newRecord = new AutoBetting({
            user: person.id,
            game: gameToReactorOn,
            time: clickTime
          });

          await newRecord.save();
        });
      }

      if (reactorSwitch == 'off') {
        stuff.forEach(async person => {
          const isRecord = await AutoBetting.findOne({
            user: person.id,
            game: gameToReactorOn
          });

          if (isRecord) {
            await AutoBetting.findOneAndDelete({
              user: person.id,
              game: gameToReactorOn
            });
          }
        });
      }

      // конец реактора

      res.json({
        success: true,
        humanId: game.humanId,
        reactor: reactorSwitch
      });
    }
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
    totalIncome,
    status,
    duration,
    caption,
    description,
    autoBetting,
    betSize,
    singleStep,
    winner,
    winnerId,
    lastClick,
    timer,
    reactor
  } = req.body;

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  if (!humanId) {
    humanId = getRandomInt(10000, 90000);
  }

  if (!currentPrice) {
    currentPrice = 250;
  }

  if (!singleStep) {
    singleStep = 1;
  }

  if (!totalIncome) {
    totalIncome = 0;
  }

  if (!status) {
    status = 'holded';
  }

  if (!winner) {
    winner = '-';
  }

  if (!winnerId) {
    winnerId = '000';
  }

  if (!lastClick) {
    lastClick = Date.now();
  }

  if (!reactor) {
    reactor = 'off';
  }

  if (!timer) {
    timer = 0;
  }

  try {
    let game = null;
    let gamehistory = null;

    if (updateFlag) {
      game = await Games.findOneAndUpdate(
        { humanId: humanId },
        req.body,
        { upsert: false },
        null
      );

      gamehistory = await GameHistory.findOneAndUpdate(
        { humanId: humanId },
        req.body,
        { upsert: false },
        null
      );
    } else {
      game = await Games.findOne({ humanId: humanId });
      gamehistory = await GameHistory.findOne({ humanId: humanId });
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
        totalIncome,
        status,
        duration,
        caption,
        description,
        autoBetting,
        betSize,
        singleStep,
        winner,
        winnerId,
        timer,
        lastClick,
        reactor
      });

      gamehistory = new GameHistory({
        humanId,
        marketPrice,
        currentPrice,
        totalIncome,
        status,
        duration,
        caption,
        description,
        autoBetting,
        betSize,
        singleStep,
        winner,
        winnerId,
        reactor
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
    await gamehistory.save();

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

// @route    GET api/admin/games/gamover
// @desc     autobetting collection clear for ended game
// @access   Public
router.get('/games/gamover', async (req, res) => {
  console.log('api admin gameover');
  const gameOvered = req.body.game;

  try {
    let autobettings = await AutoBetting.find({
      game: game.id
    });

    if (autobettings.length < 1) {
      return res.status(400).json({
        success: false,
        error: 'No games in autobetting collection'
      });
    }
    console.log('deleting game from autobettings: (gamover) ', game.id);
    autobettings.forEach(async singleGame => {
      await AutoBetting.findOneAndDelete({
        game: singleGame.id
      });
    });

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

    // if (!gameInGames) {
    //   res.status(404).send('Game not found. Nothing to delete!');
    // }

    const gameInGameHistory = await GameHistory.findOneAndUpdate(
      { humanId: humId },
      { status: 'inHistory' },
      { upsert: false },
      null
    );

    // if (!gameInGameHistory) {
    //   res
    //     .status(404)
    //     .send('Game not found in GameHistory Collection. Nothing to change!');
    // }

    res.json({ success: true, deleted: humId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
