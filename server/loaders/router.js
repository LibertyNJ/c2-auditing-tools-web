const router = require('../routes');

module.exports = (app, db) => {
  app.use(router(db));
};
