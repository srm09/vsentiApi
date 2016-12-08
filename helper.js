// Convert timestamp in millis to date object

// CompareTo() timestamps

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'vsenti_database',
  user     : 'vsenti',
  password : '123456',
  database : 'vsenti_database'
});

function executeQuery(queryString, processResults) {
  connection.connect();
  connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
    console.log('Processing results for queryString: '+queryString);
    processResults(rows, fields);
  });
  connection.end();
}

module.exports.executeQuery = executeQuery;
