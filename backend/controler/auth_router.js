const express = require('express');
const path = require('path');
const router = express.Router();
const userClass = require('../model/user_class');


router.get('/', (req, res, next) => {
    if (req.session && req.session.user) {
        res.redirect(`/homepage?user:${req.session.id}`);
    } else {
        res.redirect('/users/login');
    }
});

router.get('/users/login', (req, res, next) => {
    res.render('../view/login', {});
});

router.post('/users/login', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const userObj = new userClass(0, email, password, null);
    const resp = await userObj.logUser();
    if (resp) {
        req.session.user = email;
        req.session.save();
        res.redirect('/');
    } else {
        res.redirect('/users/signin');
    }
});

router.get('/users/signin', async (req, res, next) => {
    res.render('../view/signin');
});

router.post('/users/signin', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const userObj = new userClass(0, email, password, null);
    const resp = await userObj.createUser();
    if (resp) {
        req.session.user = email;
        req.session.save();
        res.redirect('/');
    } else {
        res.write("<h1>bad mistake</h1>");
        res.end();
    }
});

router.post('/users/logoff', async (req, res, next)=>{
    req.session.destroy();
    res.redirect('/');
})

module.exports = router;