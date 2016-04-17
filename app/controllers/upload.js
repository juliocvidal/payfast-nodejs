var fs = require('fs');
var zlib = require('zlib');

module.exports = function(app) {
    app.post("/upload/gzip",function(req, res) {

      var arquivo = req.headers.filename;
      console.log('arquivo recebido: ' + arquivo);

      req.pipe(zlib.createGunzip())
        .pipe(fs.createWriteStream("files/" + arquivo))
        .on('finish', function(){
          res.writeHead(201, {'Content-type': 'text/plain'});
          res.end('ok');
          console.log('arquivo salvo: files/' + arquivo);
        });
    });
  }
