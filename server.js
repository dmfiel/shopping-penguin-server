const express = require('express');
const cors = require('cors');
const db = require('./app/models');
const dbConfig = require('./app/config/db.config');

// Initiallize Express / CORS connection
const app = express();

var corsOptions = {
  origin: 'http://localhost:8081'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Shopping Penguin.' });
});
// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Initialize MongoDB connection
const Role = db.role;
mongoConnect();

async function mongoConnect() {
  try {
    await db.mongoose.connect(
      `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`
    );
    console.log('Successfully connected to MongoDB.');
    initializeRoles();
  } catch (err) {
    console.error('Connection error', err);
    process.exit();
  }
}

async function initializeRoles() {
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
