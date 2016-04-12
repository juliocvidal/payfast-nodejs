module.exports = function(app) {
    app.get("/pagamentos",function(req, res) {

      res.send('ok');
    });

    app.post("/pagamentos/pagamento",function(req, res) {
      var pagamento = req.body;
      console.log('processando pagamento...');

      var connection = app.infra.connectionFactory();
      var pagamentoDao = new app.infra.PagamentoDao(connection);

      pagamento.status = "CRIADO";
      pagamento.data =  new Date;
      pagamentoDao.salva(pagamento);

      res.json(pagamento);
    });
}
