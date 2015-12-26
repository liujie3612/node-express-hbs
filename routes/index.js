var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    var Number = Math.round(Math.random() * 10);
    res.locals.layout = 'layouts/main';
    res.render('index', {
        luckyNumber: Number
    });
});

module.exports = router;
