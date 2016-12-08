var express = require('express')
var app = express(),
    path = require('path')
var helper = require('./helper.js')

// Defaults
var productCounter = 1;
var CHUNK_SIZE = 7;

// Query Strings
GET_PRODUCT_LIST = "SELECT * FROM product"
GET_SENTIMENT_FOR_PRODUCT =
"SELECT a.id, a.published_at, ast.sentiment_id \
FROM article_sentiment AS ast, article AS a, product AS p \
WHERE ast.article_id = a.id AND \
      a.published_at BETWEEN SUBDATE(CURDATE(), $RANGE) AND CURDATE() AND \
      ast.sentiment_id IN (SELECT id \
        FROM sentiment AS s \
        WHERE s.product_id = $PRODUCT_ID \
              OR s.product_id IS NULL) \
ORDER BY a.published_at ASC "

// Use middleware for hosting static files
app.use('/public', express.static('ProjectIpsum'))

app.get('/', function (req, res) {
  //res.sendFile(path.join(__dirname + '/index.html'))
})

app.listen(4000, function () {
  console.log('Example app listening on port 3000!')
})

// List of products supported by vSenti analyzer
app.get('/products', (req, res) => {
  helper.executeQuery(GET_PRODUCT_LIST, (results, fields) => {
    console.log("Fetched reults are: "+JSON.stringify(results, null, 4))
    console.log("Fetched fields are: "+JSON.stringify(fields, null, 4))
    var products = []
    for(var i=0;i <results.length; ++i) {
      var product = results[i]
      products.push({
        name: product.name,
        id: product.id
      })
    }
    res.send(products)
  })
})

// Time series data for product (@param product) for the lat 3 months
// starting from (@param time)
app.get('/time_series_data/:product/:time', (req, res) => {
  var product_id = req.params.product
  fetchTimeSeriesData(product_id, 90, chunkToWeeks(res))
})

var modifyDate = function(dt, hours=0, minutes=0, seconds=0) {
  dt.setHours(hours)
  dt.setMinutes(minutes)
  dt.setSeconds(seconds)
  return dt;
}

var getEndChunk = function(startDate, chunkSize) {
  var endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + chunkSize - 1)
  return modifyDate(endDate, 23, 59, 59)
}

var chunkToWeeks = function(res) {
  return function(results) {
      var startDate = modifyDate(new Date(results[0].published_at))
      var chunkEndDate = getEndChunk(startDate, CHUNK_SIZE)

      var chunkedResults = []
      var chunkNumber = 1
      var returnObj = []
      for(var i=0; i<results.length; ++i) {
        var temp = results[i]
        chunkedResults.push(temp)
        if(helper.compareTimestamps(new Date(temp.published_at), chunkEndDate) > 0) {

          returnObj.push(processChunkAndGenerateTimeSeriesData(chunkedResults, chunkNumber, chunkEndDate))
          chunkNumber++;
          var temp = new Date(chunkEndDate)
          temp.setDate(temp.getDate() + 1)
          startDate = modifyDate(temp)
          chunkEndDate = getEndChunk(startDate, CHUNK_SIZE)
        }
      }
      res.send(returnObj)
    }
}

var processChunkAndGenerateTimeSeriesData = function(results, weekNumber, endChunkDate) {
  var score = calculateScore(results)
  return getTimeSeriesObject(weekNumber, score, endChunkDate)
}

// Calculate sentiment score
var calculateScore = function(results) {
  var rawScore = 0
  for(var i=0; i<results.length; ++i) {
    if(results[i].sentiment_id != 7){
      if(results[i].sentiment_id %2 == 0){
        rawScore--;
      }
      else {
        rawScore++;
      }
      }
  }
  return rawScore/results.length * 5
}

// Generate the time series data object
var getTimeSeriesObject = function(weekNumber, calculatedValue, endOfWeekDate) {
  var timeSeriesObj = {
    weekNumber: weekNumber,
    value: calculatedValue,
    endOfWeekDate: endOfWeekDate
  }
  return timeSeriesObj;
}

// Fetches data based on the input params
var fetchTimeSeriesData = function(product, range, processResults) {
  var queryString = GET_SENTIMENT_FOR_PRODUCT.replace("$PRODUCT_ID", product).replace("$RANGE", range)
  helper.executeQuery(queryString, (results, fields) => {
    processResults(results)
  })
}
