const { authJwt } = require('../middlewares');
const controller = require('../controllers/lists.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.get('/api/lists', [authJwt.verifyToken], controller.getLists);
  app.get('/api/listsmod', [authJwt.verifyToken], controller.getListsModDate);
  app.post('/api/lists', [authJwt.verifyToken], controller.postLists);
  app.get('/api/');
};
