var express = require('express')
var app = express(),
    path = require('path')
var helper = require('./helper.js')
var api = require('./api.js')

// Defaults


app.set('view engine', 'ejs');

// Use middleware for hosting static files
app.use('*/images', express.static('images'))
app.use('*/assets', express.static('assets'))

// Configure API Router
app.use('*/api', api)

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/results/:name', function (req, res) {
  res.render('result_page.ejs', {productId: req.params.name})
})

app.get('/hack/:name', function (req, res) {
  console.log(req.params.name)
  res.sendFile(path.join(__dirname + '/result_page.html'))
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
