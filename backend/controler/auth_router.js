const express = require('express');
const path = require('path');
const router = express.Router();
const userClass = require('../model/user_class');

router.post('/users/login', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const userObj = new userClass({email: email, password: password});
    const resp = await userObj.logUser();
    if (resp) {
        req.session.user = email;
        req.session.userId = resp.rows[0].user_id;
        req.session.save();
        res.json({message: "Usuário logado com sucesso", user: resp.rows[0].user_email, userId: resp.rows[0].user_id});
        res.end();
    } else {
        res.json({message: "Usuário não encontrado"});
        res.end();
    }
});

router.post('/users/signin', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const userObj = new userClass(0, email, password, null);
    const resp = await userObj.createUser();
    if (resp) {
        req.session.user = email;
        req.session.save();
        res.json({message: "Sucesso na criação de usuário"});
        res.end();
    } else {
        res.json("Erro no banco de dados, verifique a entrada de dados");
        res.end();
    }
});

router.post('/users/logoff', async (req, res, next)=>{
    req.session.destroy();
    res.json("Logoff feito com sucesso");
});

module.exports = router;