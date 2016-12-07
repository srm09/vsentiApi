var express = require('express')
var app = express(),
    path = require('path')
var mysql = require('mysql')

// Defaults
var productCounter = 1;
var vProduct = function(name){
  this.name = name
  this.id = productCounter++;
}

// Use middleware for hosting static files
app.use('/public', express.static('ProjectIpsum'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

// List of products supported by vSenti analyzer
app.get('/products', (req, res) => {

})

// Time series data for product (@param product) for the lat 3 months
// starting from (@param time)
app.get('/time_series_data/:product/:time', (req, res) => {

})
