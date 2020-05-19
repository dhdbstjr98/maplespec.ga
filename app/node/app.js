var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var db;

fs.readFile('./config/db_password.secret', function(err, data) {
	db = mysql.createConnection({
	  host: "172.28.0.4",
	  port: 3306,
	  user: "root",
	  password: data,
	  database: "mysql"
	});

	db.connect();
});

app.get('/query', function (req, res) {
    db.query("SHOW DATABASES",
      function(err, results, fields) {
        if (err) throw err;
        var string = JSON.stringify(results);
        res.send(string);
      }
    );
});

var server = app.listen(80);