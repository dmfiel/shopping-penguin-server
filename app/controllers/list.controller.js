/* eslint-disable space-before-function-paren */
const db = require('../models');
const { createToken } = require('./auth.controller.js');

async function postLists(req, res) {
  const Lists = db.lists;
  // console.log('req headers: ', req.headers);
  try {
    // console.log('post body: ', req.body);
    // new: returns the modified doc
    // upsert: creates the doc if it doesn't exist
    const options = { new: true, upsert: true };
    const user = req.userId;
    const listJSON = JSON.stringify(req.body);
    let record = new Lists({
      userid: user,
      lists: listJSON
    });

    record = await Lists.findOneAndUpdate(
      {
        userid: req.userId
      },
      record,
      options
    );

    if (!record) {
      console.error('Unable to save lists to db.');
      res.status(500).send({ message: 'Unable to save lists to db.' });
      return;
    }

    res.send({ message: 'Lists saved successfully' });
    console.log(`Lists for (${user}) saved.`);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err });
  }
}

async function getLists(req, res) {
  const Lists = db.lists;
  try {
    const record = await Lists.findOne({
      userid: req.userId
    });

    if (!record) {
      console.log(`Lists for user (${req.userId}) not found.`);
      return res.status(404).send({ message: 'Lists not found.' });
    }

    const token = createToken(req.userId);

    // console.log(record.lists);
    res.status(200).send({
      id: req.userId,
      accessToken: token,
      lists: JSON.parse(record.lists)
    });
    console.log(`Lists for (${req.userId}) sent.`);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
}

module.exports = { postLists, getLists };
