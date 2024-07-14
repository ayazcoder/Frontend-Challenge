var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

var itemsRouter = require('./routes/items');

app.use(bodyParser.json());
app.use('/items', itemsRouter);
app.use('/images', express.static(path.join(__dirname, 'server/images')));

// Error handling middleware
app.use(function(req, res, next) {
    res.status(404).send('Not Found');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

var port = 5000;
app.listen(port, function() {
    console.log('Server is running on port', port);
});
