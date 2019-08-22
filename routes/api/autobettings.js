const express = require('express');
const router = express.Router();
const config = require('config');
const AutoBetting = require('../../models/AutoBetting');
const socketIOClient = require('socket.io-client');
const configClient = require('../../client/src/config.json');

console.log('AutoBetting control is here');

// autoexec
autoexec = async (user, game, clickTime) => {
  if (user == null && game == null && clickTime == null) {
    console.log('autoexec null params');

    // запуск автобеттинга без параметра

    let allGames = await AutoBetting.find();

    console.log('cron is running on server');

    const gamesToRefresh = [];

    for (var q = 0; q < allGames.length; q++) {
      const currentUser = allGames[q].user[0];
      const singleGame = allGames[q].game[0];
      const clickTime = allGames[q].clickTime;

      const lastClick = singleGame.lastClick;
      const timeToClick = lastClick + clickTime * 1000;
      const currentDate = Date.now();

      if (singleGame.winner != currentUser.nick) {
        if (currentDate >= timeToClick) {
          gamesToRefresh.push(singleGame);

          // contribute
          console.log('api autobetting contribute by autoexec ');
          try {
            const chosenGame = await Games.findOne({ _id: singleGame._id });

            if (chosenGame.status == 'opened') {
              const balance = currentUser.balance;

              const newValue = balance - chosenGame.betSize;

              if (newValue > 0) {
                await Games.updateOne(
                  { _id: singleGame._id },
                  {
                    totalIncome: chosenGame.totalIncome + chosenGame.betSize,
                    currentPrice:
                      chosenGame.currentPrice + chosenGame.singleStep,
                    winner: currentUser.nick,
                    lastClick: currentDate
                  }
                );

                const userContribution = chosenGame.betSize;

                const userDiscount =
                  (userContribution - chosenGame.singleStep) / 4;

                const updatedUser = await User.findOne({
                  _id: currentUser._id
                });

                const userOverallContribution = updatedUser.contribution;

                const userOverallDiscount = updatedUser.discount;

                const userOverallBalance = updatedUser.balance;

                console.log('userContribution', userContribution);
                await User.updateOne(
                  { _id: currentUser._id },
                  {
                    contribution: userOverallContribution + userContribution,
                    discount: userOverallDiscount + userDiscount,
                    balance: userOverallBalance - userContribution
                  }
                );
              } else {
                console.log('user ' + currentUser.nick + ' is out of money');
              }
            } else {
              console.log('wrong game status to autoexec');
            }
          } catch (err) {
            console.error('some error with autoexe contrinute');
          }
        }
      } else {
        console.log('same user - hold turn');
      }
    }

    // дернуть сокет отсюда
    const socket = socketIOClient('http://localhost:4001');
    socket.emit('playgroundRefresh', gamesToRefresh);
    // console.log(gamesToRefresh);
    return;
  }
};
// Routes
router.post('/', async (req, res) => {
  const user = req.body.user;
  console.log('autobettings api');
  try {
    let userAutobettingGames = await AutoBetting.find({ user });

    res.json({ success: true, games: userAutobettingGames });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/get-timers', async (req, res) => {
  try {
    let status = req.body.status;
    let allGames = await Games.find({ status });
    let timers = [];
    let timerUpdated = null;

    for (var i = 0; i < allGames.length; i++) {
      if (allGames[i].lastClick) {
        timerUpdated = (Date.now() - allGames[i].lastClick) / 1000;
        timers.push({ game: allGames[i]._id, timer: timerUpdated });
      }
    }
    // console.log('timers', timers);
    res.json({ success: true, timers: timers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/refresh-game', async (req, res) => {
  try {
    console.log('route refresh');
    const games = req.body.games;
    const gameList = await Games.find({ status: 'opened' });
    let gamesToChange = [];

    gameList.forEach(element => {
      for (var i = 0; i < games.length; i++) {
        if (element.humanId === games[i].humanId) {
          gamesToChange.push(element);
        }
      }
    });
    res.json({ success: true, games: gamesToChange });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
