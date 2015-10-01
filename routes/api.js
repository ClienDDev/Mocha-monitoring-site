var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res, next) {
    res.json({status: 'ok'});
});

router.get('/tests', function(req, res){
    fs.readdir('./tests/', function(err, files){
        if(err)
            res.json({'error': err});

        var return_json = [];

        files.forEach(function(file){
            if(file != '..' && file != '.')
                return_json.push(file.replace('.js', ''));
        });

        res.json(return_json);
    })
});

router.get('/tests/:name', function(req, res){
    res.json(req.params.name);
});

module.exports = router;
