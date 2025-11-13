/* eslint-disable space-before-function-paren */
const db = require('../models/index.js');
const { createToken } = require('./auth.controller.js');

async function postItem(req, res) {
  const Item = db.item;
  // console.log('req headers: ', req.headers);
  try {
    // console.log('post body: ', req.body);
    const user = req.userId;
    let record = null;
    if (req.body._id) {
      record = await Item.findOne({
        $and: [{ userid: user }, { _id: req.body._id }]
      });
    }
    if (req.body._id && record) {
      console.log(`Found Item (${req.body._id}), updating.`);
      record = Object.assign(record, req.body);
    } else {
      console.log(`Item (${req.body._id}) not found to update, creating one.`);
      record = new Item(req.body);
    }

    record.userid = user;

    // console.log(record);
    await record.save();

    const token = createToken(user);

    res.send({
      message: 'Item saved successfully',
      accessToken: token,
      _id: record._id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    });
    console.log(`Item for (${user}) saved.`);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err });
  }
}

async function getItems(req, res) {
  const Item = db.item;
  try {
    const records = await Item.find({
      userid: req.userId
    });

    if (!records || !records.length) {
      console.log(`Items for user (${req.userId}) not found.`);
      return res.status(404).send({ message: 'Items not found.' });
    }

    // console.log(records);
    res.status(200).json(records);

    console.log(`Items (${records.length}) for (${req.userId}) sent.`);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
}

module.exports = { postItem, getItems };
