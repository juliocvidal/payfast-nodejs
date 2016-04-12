var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');

module.exports = function() {
  var app = express();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  load('controllers', {cwd: 'app'})
      .then('infra')
      .into(app);
  return app;
}
