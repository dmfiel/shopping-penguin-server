const { authJwt } = require('../middlewares');
const controller = require('../controllers/list.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Origin',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.get('/api/lists', [authJwt.verifyToken], controller.getLists);
  app.post('/api/lists', [authJwt.verifyToken], controller.postLists);
};
