var app = require('./config/express')();

app.get('/hello', function (req, res) {
   res.send('hi');
});

app.listen(3000, function(){
  console.log("Server up!");
});
