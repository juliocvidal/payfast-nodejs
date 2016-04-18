var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var morgan = require('morgan');
var logger = require('../app/infra/logger.js');
var core = require('core');

module.exports = function() {
  var app = express();

  app.use(morgan("common", {
    stream: {
      write: function(message){
        logger.info(message)
      }
    }
  }));

  app.use('cors'({
    origin: "http://localhost:3001";
    methods: ["GET". "POST", "PUT", "DELETE"],
    allowedHeaders: "Content-type"
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
