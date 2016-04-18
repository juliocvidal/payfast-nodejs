var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var morgan = require('morgan');
var logger = require('../app/infra/logger.js');

module.exports = function() {
  var app = express();

  app.use(morgan("common", {
    stream: {
      write: function(message){
        logger.info(message)
      }
    }
  }));

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.use(expressValidator()); //Obrigatoriamente logo apos o bodyParser

  load('controllers', {cwd: 'app'})
      .then('infra')
      .then('servicos')
      .into(app);
  return app;
}
