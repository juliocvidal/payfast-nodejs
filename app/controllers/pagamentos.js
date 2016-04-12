module.exports = function(app) {
    app.get("/pagamentos",function(req, res) {

      res.send('ok');
    });

    app.post("/pagamentos/pagamento",function(req, res) {
      var pagamento = req.body;

      console.log(pagamento);
      res.send('ok');
    });
}
