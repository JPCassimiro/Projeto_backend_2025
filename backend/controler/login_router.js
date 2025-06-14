const express = require('express');
const path = require('path');
const router = express.Router();


router.get('/', (req,res,next)=>{
    if(req.session & req.session){
        res.redirect(`/homepage?user:${req.session.login}`);
    }else{
        res.redirect('/users/login');
    }
});

router.post('/users/login', (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    
})

module.exports = router;