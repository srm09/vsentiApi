var express = require('express')
var app = express(),
    path = require('path')
var helper = require('./helper.js')

// Defaults
var productCounter = 1;
// var vProduct = function(name){
//   this.name = name
//   this.id = productCounter++;
// }

// Query Strings
GET_PRODUCT_LIST = "SELECT * FROM product"

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

})
