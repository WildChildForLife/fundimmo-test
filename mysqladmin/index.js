var express = require('express');
var app = express();

var mysqlAdmin = require('node-mysql-admin');
app.use(mysqlAdmin(app));

app.listen(3333);