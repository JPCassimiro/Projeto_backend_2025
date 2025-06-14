const http = require('http');
const path = require('path');
const express = require('express');
const session = require('express-session');
const loginRoutes = require('./backend/controler/login_router')

const port = 3000;


app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'backend/view'));
app.use(express.urlencoded({extended:false}));

app.use(loginRoutes);

app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:true,
    cookie: {secure: true}
}))

app.get('/',(req, res, next)=>{

});


app.listen(port);