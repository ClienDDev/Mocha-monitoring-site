var express = require('express');
var router = express.Router();
var fs = require('fs');
var child_process = require('child_process');

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

router.get('/tests/:name', function(req, res) {
    var test_name = req.params.name;
    var test_path = './tests/' + test_name + '.js';

    if (!fs.existsSync(test_path))
        return res.status(404).json({error: 'file not found'});

    child_process.exec('mocha -R json ' + test_path, {
        cwd: process.cwd()
    }, function (error, stdout, stderr) {
        res.send(stdout);
    });
});

module.exports = router;
