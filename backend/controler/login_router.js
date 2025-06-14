const express = require('express');
const path = require('path');
const router = express.Router();
const userClass = require('../model/user_class');


router.get('/', (req,res,next)=>{
    if(req.session & req.session){
        res.redirect(`/homepage?user:${req.session.login}`);
    }else{
        res.redirect('/users/login');
    }
});

router.get('/users/login', (req,res,next)=>{
    res.render('../view/login',{});
});

router.post('/users/login', async (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const userObj = new userClass(0,req.body.email,req.body.password,null);
    const resp = await userObj.logUser();
    if(0){
        req.session.login = email;
        res.write("<p>Login sucesso</p>")
        res.end();
        return;
    }else{
        res.status(403);
        res.write("ooops");
        res.end();
    }
});

module.exports = router;