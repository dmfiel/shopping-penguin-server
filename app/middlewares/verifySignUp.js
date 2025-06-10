const db = require('../models/index');
const ROLES = db.ROLES;
const User = db.user;

async function checkDuplicateUsernameOrEmail(req, res, next) {
  try {
    // Username
    let user = await User.findOne({ username: req.body.username });
    if (user) {
      res
        .status(400)
        .send({ message: 'Error: that username is already in use.' });
      console.log(`Error: username (${req.body.username}) is already in use.`);
      return;
    }

    // Email
    user = await User.findOne({
      email: req.body.email
    });
    if (user) {
      res
        .status(400)
        .send({ message: 'Error: that email address is already in use.' });
      console.log(
        `Error: email address (${req.body.email}) is already in use.`
      );
      return;
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err });
  }
}

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (const role of req.body.roles) {
      if (!ROLES.includes(role)) {
        res.status(400).send({
          message: `Error: role ${role} does not exist.`
        });
        console.log(`Error: role ${role} does not exist.`);
        return;
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;
