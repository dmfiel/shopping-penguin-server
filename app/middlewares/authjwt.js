/* eslint-disable space-before-function-paren */
const jwt = require('jsonwebtoken');
const config = require('../../auth.config.js');
const db = require('../models/index.js');

const verifyToken = (req, res, next) => {
  //  console.log('request headers: ', req.headers);
  let token = req.headers['x-access-token'];
  if (!token) token = req.headers.authorization;
  // console.log('token: ', token);

  if (!token) {
    console.log('Unauthorized, no token provided.');
    return res
      .status(403)
      .send({ message: 'Unauthorized, please provide a token.' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log('Access expired, please signin for a new token.');
      return res.status(401).send({
        message: 'Access expired, please signin for a new token.'
      });
    }
    req.userId = decoded.id;
    // console.log('decoded id: ', decoded.id);
    next();
  });
};

async function isRole(req, res, next, roleNeeded) {
  const User = db.user;
  const Role = db.role;
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });
    for (const role of roles) {
      if (role.name === roleNeeded) {
        next();
        return;
      }
    }
    console.log(`Error: ${roleNeeded} role is required`);
    res.status(403).send({ message: `${roleNeeded} role is required` });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
}

function isAdmin(req, res, next) {
  isRole(req, res, next, 'admin');
}
function isModerator(req, res, next) {
  isRole(req, res, next, 'moderator');
}

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
module.exports = authJwt;
