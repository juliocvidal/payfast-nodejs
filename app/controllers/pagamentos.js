const PAGAMENTO_CRIADO = "CRIADO";
const PAGAMENTO_CONFIRMADO = "CONFIRMADO";
const PAGAMENTO_CANCELADO = "CANCELADO";



module.exports = function(app) {
    app.get("/pagamentos/pagamento/:id",function(req, res) {
      var id = req.params.id;
      var cache = app.infra.memcachedClient();

      console.log('id: ' + id);

      cache.get('pagamento-' + id, function (err, data) {

        if (err || !data){

          var connection = app.infra.connectionFactory();
          var pagamentoDao = new app.infra.PagamentoDao(connection);

          pagamentoDao.buscaPorId(id, function(exception, resultado){

            cache.set('pagamento-' + id, resultado, 100000, function (err) {
               console.log('nova chave: pagamento-' + id)
             });
            res.status(200).json(resultado);
          });
        } else {
          res.status(200).json(data);
        }
      });
    });

    app.post("/pagamentos/pagamento",function(req, res) {
      var body = req.body;
      var pagamento = body['pagamento'];

      req.assert("pagamento.forma_de_pagamento", "Forma de pagamento é obrigatória.").notEmpty();
      req.assert("pagamento.valor", "Valor é obrigatório e deve ser um decimal.").notEmpty().isFloat();
      req.assert("pagamento.moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3,3);

      var errors = req.validationErrors();

      if (errors){
        console.log("Erros de validação encontrados");

        res.status(400).send(errors);
        return;
      }

      console.log('processando pagamento...');

      var connection = app.infra.connectionFactory();
      var pagamentoDao = new app.infra.PagamentoDao(connection);

      pagamento.status = PAGAMENTO_CRIADO;
      pagamento.data =  new Date;

      pagamentoDao.salva(pagamento, function(exception, result){
        if (exception){
          console.log(exception);
        }

        console.log('pagamento criado: ' + result);

        res.location('/pagamentos/pagamento/' + result.insertId);
        pagamento.id = result.insertId;

        var cache = app.infra.memcachedClient();
        cache.set('pagamento-' + result.insertId, result, 100000, function (err) {
           console.log('nova chave: pagamento-' + id)
         });

        if (pagamento.forma_de_pagamento == 'cartao'){
          console.log('pagamento com cartão');

          var cartoesClient = new app.servicos.CartoesClient();
          cartoesClient.autoriza(body['cartao'], function (err, request, response, retorno) {
            if (err){
              console.log("Erro ao consultar serviço de cartões.");
              res.status(400).send(err);
              return;
            }

            console.log('Retorno do servico de cartoes: %j', retorno);

            var response = {
              dados_do_pagamento: pagamento,
              cartao : retorno,
              links: [
                      {
                        href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                        rel: "confirmar",
                        method: "PUT"
                      },
                      {
                        href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                        rel: "cancelar",
                        method: "DELETE"
                      }
                    ]
            }

            res.status(201).json(response);
          });

        } else {
          var response = {
            dados_do_pagamento: pagamento,
            links: [
                    {
                      href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                      rel: "confirmar",
                      method: "PUT"
                    },
                    {
                      href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                      rel: "cancelar",
                      method: "DELETE"
                    }
                  ]
          }

          res.status(201).json(response);
        }
      });

    });

}
