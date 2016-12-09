// Convert timestamp in millis to date object

// CompareTo() timestamps

var mysql      = require('mysql');

function executeQuery(queryString, processResults) {
  var connection = mysql.createConnection({
    host     : 'vsenti_database',
    user     : 'vsenti',
    password : '123456',
    database : 'vsenti_database'
  });
  connection.connect();
  connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
    console.log('Processing results for queryString: '+queryString);
    console.log('Fetched row count: '+rows.length)
    processResults(rows, fields);
  });
  connection.end();
}

// Convert timestamp in millis to date object
function timestamp_to_do(current_timestamp){
	return new Date(current_timestamp);
}

// Convert timestamp in milli s to mm/dd/yyyy
function split_date(dateObj) {
	var month = dateObj.getUTCMonth() + 1;
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();

	newdate = year + "/" + month + "/" + day;
	return newdate;
}

function compare_timestamps(ts1, ts2) {
	if(ts1.getTime()==ts2.getTime()){
		return 0;
	}
	else if(ts1.getTime()<ts2.getTime()){
		return -1;
	}
	else{
		return 1;
	}
}

module.exports.executeQuery = executeQuery;
module.exports.compareTimestamps = compare_timestamps;
