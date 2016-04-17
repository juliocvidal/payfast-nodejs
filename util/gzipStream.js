var fs = require('fs');
var zlib = require('zlib');
var arquivo = process.argv[2];

fs.createReadStream(arquivo)
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream(arquivo + '.gz'))
  .on('finish', function(){
    console.log('arquivo comprimido.');
  });
