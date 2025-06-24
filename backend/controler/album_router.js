const express = require('express');
const path = require('path');
const router = express.Router();
const albumClass = require('../model/album_class');
const writeLog = require('../../logs/log_handler');

const checkSession = (session, user, route) => {
    if (session && user) {
        return true
    } else {
        writeLog(`\nUsuário tentou acessar uma rota protegida\nrota: ${route}`);
        return false;
    }
}

//Criação de albuns
router.post('/homepage/createAlbum', async (req, res, next) => {
    writeLog("\nRequisição post recebida na rota /homepage/createAlbum");
    if (checkSession(req.session, req.session.user, "/homepage/createAlbum")) {
        if (req.body.albumName != undefined && req.body.albumName != "") {
            const albumName = req.body.albumName;
            const albumObj = new albumClass({ name: albumName, userId: req.session.userId });
            const resp = await albumObj.createAlbum();
            if (resp) {
                res.json({ message: "Sucesso em criar album" });
                res.end();
                writeLog(`\nSucesso na criação de album na rota /homepage/createAlbum\nalbum_id: ${resp.rows[0].album_id} userId: ${req.session.userId}`);
            } else {
                res.json({ message: "Erro ao interno criar album" });
                res.end();
                writeLog(`\nErro na criação de album na rota /homepage/createAlbum\nuserId: ${req.session.userId} \nsession: ${req.session.id}`);
            }
        } else {
            res.json({ message: "Erro na formatação da entrada" });

            res.end();
            writeLog(`\nErro na criação de album na rota /homepage/createAlbum\nuserId: ${req.session.userId} \nsession: ${req.session.id}`);
        }
    } else {
        res.json({ message: "Você não esta logado" });
        res.end();
    }
});

//Pegando os albuns do usuário
router.get('/homepage/getUserAlbuns', async (req, res, next) => {
    writeLog(`\nRequisição get na rota /homepage/getUserAlbuns`);
    if (checkSession(req.session, req.session.user, '/homepage/getUserAlbuns')) {
        const userID = req.session.userId;
        const albumObj = new albumClass({ userId: userID });
        const resp = await albumObj.getAlbunsByUser();
        if (resp) {
            writeLog(`\nSucesso no retorno de album na rota /homepage/getUserAlbuns\nuserId: ${req.session.userId}`);
            res.json({ message: "Sucesso em retornar albums", albuns: JSON.stringify(resp.rows) });
            res.end();
        } else {
            writeLog(`\nErro ao tentar buscar albuns na rota /homepage/getUserAlbuns\nuserId: ${req.session.userId}`);
            res.json({ message: "Erro ao retornar albuns, isso ocorre caso sua conta não tenha albums ou por um erro no BD" });
            res.end();
        }
    } else {
        res.json({ message: "Você não esta logado" });
        res.end();
    }
});

//Deleção de album
router.delete('/homepage/deleteAlbum', async (req, res, next) => {
    writeLog(`\nRequisição delete na rota /homepage/deleteAlbum`);
    if (checkSession(req.session, req.session.user, '/homepage/deleteAlbum')) {
        if (req.body.albumId != undefined && req.body.albumId != null && typeof (req.body.albumId) == "number") {
            const albumId = Number(req.body.albumId);
            const albumObj = new albumClass({ id: albumId, userId: req.session.userId });
            const resp = await albumObj.deleteAlbum();
            if (resp) {
                res.json({ message: "Sucesso em apagar album" });
                res.end();
                writeLog(`\nSucesso em apagar albuns na rota /homepage/getUserAlbuns\nuserId: ${req.session.userId}\nalbum_id: ${resp.rows[0].album_id}`);
            } else {
                res.json({ message: "Erro ao apagar album" });
                res.end();
                writeLog(`\nErro ao tentar apagar um album na rota /homepage/getUserAlbuns\nuserId: ${req.session.userId}`);
            }
        } else {
            res.json({ message: "Erro na formatação da entrada" });

            res.end();
            writeLog(`\nErro ao tentar apagar um album na rota /homepage/getUserAlbuns\nuserId: ${req.session.userId}`);
        }
    } else {
        res.json({ message: "Você não esta logado" });
        res.end();
    }
});

//Atualização de album
router.patch('/homepage/updateAlbum', async (req, res, next) => {
    writeLog(`\nRequisição patch na rota /homepage/updateAlbum`);
    if (checkSession(req.session, req.session.user, '/homepage/updateAlbum')) {
        const albumId = Number(req.body.albumId);
        const albumName = req.body.albumName;
        if (albumId != undefined && typeof (albumId) === "number" && albumName != undefined && albumName != "" && typeof (albumName) === "string") {
            const albumObj = new albumClass({ name: albumName, userId: req.session.userId, id: albumId });
            const resp = await albumObj.updateAlbumName();
            if (resp) {
                res.json({ message: "Sucesso em alterar album", album: JSON.stringify(resp.rows[0]) });
                res.end();
                writeLog(`\nSucesso em alterar um album na rota /homepage/updateAlbum\nuserId: ${req.session.userId}\nalbum_id: ${resp.rows[0].album_id}`);
            } else {
                res.json({ message: "Erro ao alterar album" });
                res.end();
                writeLog(`\nErro ao tentar alterar um album na rota /homepage/updateAlbum\nuserId: ${req.session.userId}`);
            }
        } else {
            res.json({ message: "Erro na formatação da entrada" });
            res.end();
            writeLog(`\nErro ao tentar alterar um album na rota /homepage/updateAlbum\nuserId: ${req.session.userId}`);
        }
    } else {
        res.json({ message: "Você não está logado" });
        res.end();
    }
});

router.patch('/homepage/updateAlbumPreview', async (req, res, next) => {
    writeLog(`\nRequisição patch na rota /homepage/updateAlbumPreview`);
    if (checkSession(req.session, req.session.user, '/homepage/updateAlbumPreview')) {
        const albumId = Number(req.body.albumId);
        const albumPreview = Number(req.body.albumPreview);
        if (albumId != undefined && typeof (albumId) === "number" && albumPreview != undefined && typeof (albumPreview) === "number") {
            const albumObj = new albumClass({ preview: albumPreview, id: albumId, userId: req.session.userId });
            const resp = albumObj.updateAlbumPreview();
            if (resp) {
                res.json({ message: "Sucesso em alterar preview do album", album: JSON.stringify(resp.rows[0]) });
                res.end();
                writeLog(`\nSucesso em alterar um album na rota /homepage/updateAlbumPreview\nuserId: ${req.session.userId}\nalbum_id: ${resp.rows[0].album_id}`);
            } else {
                res.json({ message: "Erro ao alterar preview do album" });
                res.end();
                writeLog(`\nErro ao tentar alterar um album na rota /homepage/updateAlbumPreview\nuserId: ${req.session.userId}`);
            }
        } else {
            res.json({ message: "Erro na formatação da entrada" });

            res.end();
            writeLog(`\nErro ao tentar alterar um album na rota /homepage/updateAlbumPreview\nuserId: ${req.session.userId}`);
        }
    } else {
        res.json({ message: "Você não está logado" });
        res.end();
    }
})

//Exportando o roteador
module.exports = router;