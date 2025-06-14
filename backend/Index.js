const http = require('http');
const path = require('path');
const express = require('express');


app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'view'));
