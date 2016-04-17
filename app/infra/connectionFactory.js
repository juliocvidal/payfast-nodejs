var mysql  = require('mysql');

function createDBConnection(){
	if (!process.env.NODE_ENV) {
		return mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: '',
			database: 'payfast'
		});
	}

	if (process.env.NODE_ENV == 'sandbox') {
		return mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: '',
			database: 'payfast_sandbox'
		});
	}
}

module.exports = function() {
	return createDBConnection;
}
