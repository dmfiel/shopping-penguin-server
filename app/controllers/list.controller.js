const db = require('../models');
const Lists = db.lists;

async function postLists(req, res) {
  try {
    const lists = new Lists({
      userid: req.userId,
      lists: JSON.stringify(req.body.lists)
    });

    await lists.save();

    res.send({ message: 'Lists saved successfully!' });
    console.log(`Lists for (${req.usedid}) saved successfully!`);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err });
  }
}

async function getLists(req, res) {
  try {
    const record = await Lists.findOne({
      userid: req.userId
    });

    if (!record) {
      console.log(`Lists for user (${req.userId}) not found.`);
      return res.status(404).send({ message: 'Lists not found.' });
    }
    console.log(record.lists);
    res.status(200).send({
      id: req.userId,
      lists: JSON.parse(record.lists)
    });
    console.log(`Lists sent for (${req.userId}).`);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
}

module.exports = { postLists, getLists };
