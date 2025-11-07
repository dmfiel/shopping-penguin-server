/* eslint-disable space-before-function-paren */
const db = require('../models/index.js');
const { createToken } = require('./auth.controller.js');

async function postCategory(req, res) {
  const Category = db.category;
  // console.log('req headers: ', req.headers);
  try {
    // console.log('post body: ', req.body);
    const user = req.userId;
    let record = null;
    if (req.body._id) {
      record = await Category.findOne({
        $and: [{ userid: user }, { _id: req.body._id }]
      });
    }
    if (req.body._id && record) {
      console.log(`Found Category (${req.body._id}), updating.`);
      record = Object.assign(record, req.body);
    } else {
      console.log(
        `Category (${req.body._id}) not found to update, creating one.`
      );
      record = new Category(req.body);
    }

    record.userid = user;

    // console.log(record);
    await record.save();

    const token = createToken(user);

    res.send({
      message: 'Category saved successfully',
      accessToken: token,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    });
    console.log(`Category for (${user}) saved.`);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err });
  }
}

async function getCategories(req, res) {
  const Category = db.category;
  try {
    const records = await Category.find({
      userid: req.userId
    });

    if (!records || !records.length) {
      console.log(`Categories for user (${req.userId}) not found.`);
      return res.status(404).send({ message: 'Categories not found.' });
    }

    // console.log(records);
    res.status(200).json(records);

    console.log(`Categories (${records.length}) for (${req.userId}) sent.`);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
}

module.exports = { postCategory, getCategories };
