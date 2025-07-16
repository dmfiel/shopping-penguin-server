/* eslint-disable space-before-function-paren */
const express = require('express');
const cors = require('cors');
const db = require('./app/models');
const dbConfig = require('./db.config');

// Initiallize Express / CORS connection
const app = express();

// simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Shopping Penguin.' });
});

// use cors to specify where the front-end server can be located
const allowedOrigins = [
  'https://fiel.us',
  'http://fiel.us',
  'http://localhost:5173'
];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Origin site (${origin}) not allowed by CORS`));
    }
  }
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/list.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Initialize MongoDB connection
mongoConnect();

// async
function mongoConnect() {
  try {
    // let dbConnection = await db.mongoose.connect(dbConfig.URI);
    db.connection = db.mongoose.createConnection(dbConfig.URI);
    console.log('Successfully connected to MongoDB.');

    // mongoose.connection.useDB(dbConfig.DB);
    db.connection = db.connection.useDb(dbConfig.DB);
    console.log(`Successfully connected to database (${dbConfig.DB}).`);

    // console.log(db.connection);
    db.setupModels();
    console.log('DB models setup');

    initializeRoles();
  } catch (err) {
    console.error('Connection error', err);
    process.exit();
  }
}

async function initializeRoles() {
  const Role = db.role;
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      for (const role of ['user', 'moderator', 'admin']) {
        await new Role({
          name: role
        }).save();
        console.log(`Added '${role}' to roles collection`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}
