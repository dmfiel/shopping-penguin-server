const db = require('../models');
const { authJwt } = require('../middlewares');

async function postLists(req, res) {
  const Lists = db.lists;
  // console.log('req headers: ', req.headers);
  try {
    // console.log('post body: ', req.body);
    const user = req.userId;
    const listJSON = JSON.stringify(req.body);
    let record = await Lists.findOne({
      userid: req.userId
    });

    if (record) {
      // console.log(`Found Lists for user (${req.userId}), updating.`);
      // console.log(record.lists);
      record.lists = listJSON;
      // console.log(record.lists);
    } else {
      console.log(
        `Lists for user (${req.userId}) not found to update, creating one.`
      );
      record = new Lists({
        userid: user,
        lists: listJSON
      });
    }

    // console.log(record);
    await record.save();

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
    // console.log(record.lists);
    res.status(200).send({
      id: req.userId,
      lists: JSON.parse(record.lists)
    });
    console.log(`Lists for (${req.userId}) sent.`);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
}

module.exports = { postLists, getLists };
