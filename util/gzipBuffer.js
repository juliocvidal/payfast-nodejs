var fs = require('fs');
var zlib = require('zlib');
var arquivo = process.argv[2];

fs.readFile(arquivo, function(err, buffer){
  zlib.gzip(buffer, function(err, buffer){
    fs.writeFile(arquivo + '.gz', buffer, function(err){
        console.log('arquivo comprimido.');
    });
  });
});
