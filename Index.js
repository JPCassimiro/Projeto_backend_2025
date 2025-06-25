const http = require('http');
const path = require('path');
const express = require('express');
const session = require('express-session');
const authRoutes = require('./backend/controler/auth_router');
const albumRouter = require('./backend/controler/album_router');
const imageRoutes = require('./backend/controler/image_router');
const junctionRoutes = require('./backend/controler/junction_router');

const port = 3000;


app = express();

app.use(express.urlencoded({extended:false}));

app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:true,
    cookie: {secure: false}
}));

app.use(authRoutes);
app.use(albumRouter);
app.use(imageRoutes);
app.use(junctionRoutes);

app.get('/homepage', (req, res, next) => {
    res.render('../view/homepage',{user: `${req.session.user}`});
});


app.listen(port);