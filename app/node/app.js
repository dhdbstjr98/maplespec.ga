let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/home', routes.home);

let server = app.listen(80);