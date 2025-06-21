const http = require('http');
const path = require('path');
const express = require('express');
const session = require('express-session');
const authRoutes = require('./backend/controler/auth_router');
const albumRouter = require('./backend/controler/album_router');

const port = 3000;


app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'backend/view'));
app.use(express.urlencoded({extended:false}));

app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:true,
    cookie: {secure: false}
}));

app.use(authRoutes);
app.use(albumRouter);

app.get('/homepage', (req, res, next) => {
    res.render('../view/homepage',{user: `${req.session.user}`});
});


app.listen(port);