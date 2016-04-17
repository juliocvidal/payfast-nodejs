var soap = require('soap');

function CorreiosSOAPClient(url) {
  this._url = url;
}

CorreiosSOAPClient.prototype.calculaPrazo = function(args, callback) {
  soap.createClient(this._url, function(err, client) {
        client.CalcPrazo(args, callback);
  });
}

module.exports = function(){
    return CorreiosSOAPClient;
};
