const config = require('../../auth.config.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');

async function signup(req, res) {
  const User = db.user;
  const Role = db.role;
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });

    await user.save();

    if (req.body.roles) {
      const roles = await Role.find({
        name: { $in: req.body.roles }
      });
      user.roles = roles.map(role => role._id);
    } else {
      const role = await Role.findOne({ name: 'user' });
      user.roles = [role._id];
    }
    await user.save();
    res.send({ message: 'User was registered successfully!' });
    console.log(`User (${req.body.username}) was registered successfully!`);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err });
  }
}

async function signin(req, res) {
  const User = db.user;
  const Role = db.role;
  try {
    const user = await User.findOne({
      username: req.body.username
    });
    if (!user) {
      console.log(`User (${req.body.username}) not found.`);
      return res.status(404).send({ message: 'User not found.' });
    }
    await user.populate('roles', '-__v');

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      console.log(`Invalid password for user (${req.body.username}).`);
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid Password!'
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: 86400 // 24 hours
    });

    const authorities = [];
    for (const role of user.roles) {
      authorities.push('ROLE_' + role.name.toUpperCase());
    }
    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token
    });
    console.log(`User (${req.body.username}) logged in.`);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
}

module.exports = { signup, signin };
