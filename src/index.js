const buildMockApp = require('./buildMockApp');

module.exports = (moqs, port = 5234, appListen = undefined) => {
  var app = buildMockApp(moqs);

  if (appListen) {
    app.listen = appListen;
  }

  app.listen(port, () => console.log(`[ MOCKER ] Running on port ${port}`)); /* eslint-disable-line no-console */
}
