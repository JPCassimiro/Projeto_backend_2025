const express = require('express');
const path = require('path');
const router = express.Router();
const userClass = require('../model/user_class');
const writeLog = require('../../logs/log_handler');

const checkSession = (session, user, route) => {
    if (session && user) {
        writeLog(`\nUsuário tentou acessar uma rota protegida\nrota: ${route}`);
        return true
    } else {
        return false;
    }
}

router.post('/users/login', async (req, res, next) => {
    writeLog("\nRequisisção post recebida na rota /users/login");
    const email = req.body.email;
    const password = req.body.password;
    if (password == undefined || password === "" || email == undefined || email === "") {
        res.status(400).json({
            message: "Erro ao fazer login. Formatação da entrada errada ou você não tem uma conta.",
            parametrosEsperados: {
                email: "string",
                password: "string",
            },
            bodyType: "form-urlencoded"
        });
        res.end();
        writeLog("\nErro na criação de usuário na rota /users/login");
    }
    const userObj = new userClass({ email: email, password: password });
    const resp = await userObj.logUser();
    if (resp) {
        req.session.user = email;
        req.session.userId = resp.rows[0].user_id;
        req.session.save();
        res.status(200).json({ message: "Usuário logado com sucesso", user: resp.rows[0].user_email, userId: resp.rows[0].user_id });
        res.end();
        writeLog(`\nUsuário fez login com sucesso na rota /users/login\nID: ${resp.rows[0].user_id}`);
    } else {
        res.status(500).json({ message: "Erro interno no servidor" });
        res.end();
        writeLog("\nErro no login de usuário na rota /users/login");
    }
});

router.post('/users/signin', async (req, res, next) => {
    writeLog("\nRequisisção post recebida na rota /users/signin");
    const email = req.body.email;
    const password = req.body.password;
    if (password == undefined || password == "" || email == undefined || email == "") {
        res.status(400).json({
            message: "Erro ao criar uma conta. Formatação de entrada errada.",
            parametrosEsperados: {
                email: "string",
                password: "string",
            },
            bodyType: "form-urlencoded"
        });
        res.end();
        writeLog("\nErro na criação de usuário na rota /users/signin");
    }
    const userObj = new userClass({ email: email, password: password });
    const resp = await userObj.createUser();
    if (resp) {
        req.session.user = email;
        req.session.save();
        res.status(200).json({ message: "Sucesso na criação de usuário" });
        res.end();
        writeLog(`\nSucesso na criação de usuário na rota /users/signin\nID: ${resp.rows[0].user_id}`);
    } else {
        res.status(500).json({
            message: "Erro ao criar uma conta. Erro interno no banco de dados.",
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
    if (checkSession(req.session, req.session.user, '/users/logoff')) {
        req.session.destroy();
        res.status(200).json("Logoff feito com sucesso");
        writeLog(`\n Usuário ${req.session.userId} fez logout com sucesso na rota /users/logoff`);
        res.end();
    } else {
        res.status(403).json({ message: "Você não esta logado" });
        res.end();
    }
});

module.exports = router;