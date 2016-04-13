module.exports = function(app) {
    app.post("/pagamentos/pagamento",function(req, res) {
      var pagamento = req.body;

      req.assert("forma_de_pagamento", "Forma de pagamento é obrigatória.").notEmpty();
      req.assert("valor", "Valor é obrigatório e deve ser um decimal.").notEmpty().isFloat();
      req.assert("moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3,3);

      var errors = req.validationErrors();

      if (errors){
        console.log("Erros de validação encontrados");

        res.status(400).send(errors);
        return;
      }

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
