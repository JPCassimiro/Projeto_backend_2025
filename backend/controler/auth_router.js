const express = require('express');
const path = require('path');
const router = express.Router();
const userClass = require('../model/user_class');
const writeLog = require('../../logs/log_handler');

router.post('/users/login', async (req, res, next) => {
    writeLog("\nRequisisção post recebida na rota /users/login");
    const email = req.body.email;
    const password = req.body.password;
    const userObj = new userClass({ email: email, password: password });
    const resp = await userObj.logUser();
    if (resp) {
        req.session.user = email;
        req.session.userId = resp.rows[0].user_id;
        req.session.save();
        res.json({ message: "Usuário logado com sucesso", user: resp.rows[0].user_email, userId: resp.rows[0].user_id });
        res.end();
        writeLog(`\nUsuário fez login com sucesso na rota /users/login\nID: ${resp.rows[0].user_id}`);
    } else {
        res.status(400).json({
            message: "Erro ao fazer login. Isso pode ocorrer caso a formatação da entrada esteja errada, caso você não tenha uma conta ou por um erro interno no banco de dados.",
            parametrosEsperados: {
                email: "string",
                password: "string",
            },
            bodyType: "form-urlencoded"
        });
        res.end();
        writeLog("\nErro no login de usuário na rota /users/login");
    }
});

router.post('/users/signin', async (req, res, next) => {
    writeLog("\nRequisisção post recebida na rota /users/signin");
    const email = req.body.email;
    const password = req.body.password;
    const userObj = new userClass({email: email, password: password});
    const resp = await userObj.createUser();
    if (resp) {
        req.session.user = email;
        req.session.save();
        res.json({ message: "Sucesso na criação de usuário" });
        res.end();
        writeLog(`\nSucesso na criação de usuário na rota /users/signin\nID: ${resp.rows[0].user_id}`);
    } else {
        res.status(400).json({
            message: "Erro ao criar uma conta. Isso pode ocorrer caso a formatação da entrada esteja errada ou por um erro interno no banco de dados.",
            parametrosEsperados: {
                email: "string",
                password: "string",
            },
            bodyType: "form-urlencoded"
        });
        res.end();
        writeLog("\nErro na criação de usuário na rota /users/signin");
    }
});

router.post('/users/logoff', async (req, res, next) => {
    writeLog("\nRequisição post recebida na rota /users/logoff");
    res.json("Logoff feito com sucesso");
    writeLog(`\n Usuário ${req.session.userId} fez logout com sucesso na rota /users/logoff`);
    req.session.destroy();
    res.end();
});

module.exports = router;