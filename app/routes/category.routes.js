const { authJwt } = require('../middlewares');
const controller = require('../controllers/category.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.get('/api/category', [authJwt.verifyToken], controller.getCategories);
  app.post('/api/category', [authJwt.verifyToken], controller.postCategory);
};
