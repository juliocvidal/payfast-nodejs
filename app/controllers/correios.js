module.exports = function(app) {
    app.get("/correios/calculo-prazo",function(req, res) {

      var correiosClient = new app.servicos.CorreiosSOAPClient('http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl');
      var args = req.body;

      correiosClient.calculaPrazo(args, function(err, resultado) {
          if (err){
            res.status(400).send(err);
            return;
          }
          res.status(200).json(resultado);
      });
    });
  }
