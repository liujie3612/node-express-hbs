var express = require('express');
var app = express();
var path = require('path');
var favicon = require('static-favicon');

app.set('views', path.join(__dirname, 'views'));

var exphbs = require('express3-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
app.get('/', function(req, res) {
    var Number = Math.round(Math.random() * 10);
    res.render('index', {
        luckyNumber: Number
    });
});
app.get('/about', function(req, res) {
    res.render('about');
})
app.use('/public', express.static('public'));

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;