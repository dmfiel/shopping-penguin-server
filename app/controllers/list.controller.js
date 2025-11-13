/* eslint-disable space-before-function-paren */
const db = require('../models/index.js');
const { createToken } = require('./auth.controller.js');

async function postList(req, res) {
  const List = db.list;
  // console.log('req headers: ', req.headers);
  try {
    // console.log('post body: ', req.body);
    const user = req.userId;
    let record = null;
    if (req.body._id) {
      record = await List.findOne({
        $and: [{ userid: user }, { _id: req.body._id }]
      });
    }
    if (req.body._id && record) {
      console.log(`Found List (${req.body._id}), updating.`);
      record = Object.assign(record, req.body);
    } else {
      console.log(`List (${req.body._id}) not found to update, creating one.`);
      record = new List(req.body);
    }

    record.userid = user;

    // console.log(record);
    await record.save();

    const token = createToken(user);

    res.send({
      message: 'List saved successfully',
      accessToken: token,
      _id: record._id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    });
    console.log(`List for (${user}) saved.`);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err });
  }
}

async function getLists(req, res) {
  const List = db.list;
  try {
    const records = await List.find({
      userid: req.userId
    });

    if (!records || !records.length) {
      console.log(`Lists for user (${req.userId}) not found.`);
      return res.status(404).send({ message: 'Lists not found.' });
    }

    // console.log(records);
    res.status(200).json(records);

    console.log(`Lists (${records.length}) for (${req.userId}) sent.`);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
}

module.exports = { postList, getLists, getProducts };

// get all products  GET /api/products
async function getProducts(req, res) {
  try {
    const match = {};
    const sortBy = {};
    let page = 1;
    let limit = 10;
    for (const param in req.query) {
      const value = req.query[param];
      if (value) {
        switch (param.toLowerCase()) {
          case 'page':
            page = +value;
            break;
          case 'limit':
            limit = +value;
            break;
          case 'sortby':
            for (const sortField of value.toString().split(',')) {
              const [field, direction] = sortField.split('_');
              sortBy[field] = direction === 'asc' ? 1 : -1;
            }
            break;
          case 'minprice':
            if (!match.price) match.price = {};
            match.price.$gte = value;
            break;
          case 'maxprice':
            if (!match.price) match.price = {};
            match.price.$lte = value;
            break;
          default:
            // match[param] = value;
            match[param] = { $eq: value };
        }
      }
    }
    console.log('Query: ', match);
    console.log('Sort: ', sortBy);
    const products = await db.product
      .find(match)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit);

    if (products) {
      res.json(products);
      console.log(`Query returned (${products.length}) products.`);
    } else res.status(500).json({ message: 'Unable to show products.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
}
