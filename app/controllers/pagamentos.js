module.exports = function(app) {
    app.post("/pagamentos/pagamento",function(req, res) {
      var pagamento = req.body;
      console.log('processando pagamento...');

      var connection = app.infra.connectionFactory();
      var pagamentoDao = new app.infra.PagamentoDao(connection);

      pagamento.status = "CRIADO";
      pagamento.data =  new Date;

      pagamentoDao.salva(pagamento, function(exception, result){
        console.log('pagamento criado: ' + result);

        res.location('/pagamentos/pagamento/' + result.insertId);
        pagamento.id = result.insertId;

        res.status(201).json(pagamento);
      });

    });

}
