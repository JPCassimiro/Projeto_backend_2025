const express = require('express');
const path = require('path');
const router = express.Router();
const albumClass = require('../model/album_class');

const checkSession = (session, user) => {
    if (session && user) {
        return true
    } else {
        return false;
    }
}

//Criação de albuns
router.post('/homepage/createAlbum', async (req, res, next) => {
    if (checkSession(req.session, req.session.user)) {
        if (req.body.albumName != undefined && req.body.albumName != "") {
            const albumName = req.body.albumName;
            const albumObj = new albumClass({ name: albumName, userId: req.session.userId });
            const resp = await albumObj.createAlbum();
            if (resp) {
                res.json({ message: "Sucesso em criar album" });
                res.end();
            } else {
                res.json({ message: "Erro ao criar album" });
                res.end();
            }
        } else {
            res.json({ message: "Erro na formatação, verifique" });
            res.end();
        }
    } else {
        res.json({ message: "Você não esta logado" });
        res.end();
    }
});

//Pegando os albuns do usuário
router.get('/homepage/getUserAlbuns', async (req, res, next) => {
    if (checkSession(req.session, req.session.user)) {
        const userID = req.session.userId;
        const albumObj = new albumClass({ userId: userID });
        const resp = await albumObj.getAlbunsByUser();
        if (resp) {
            res.json({ message: "Sucesso em retornar albums", albuns: JSON.stringify(resp.rows) });
            res.end();
        } else {
            res.json({ message: "Erro ao retornar albuns" });
            res.end();
        }
    } else {
        res.json({ message: "Você não esta logado" });
        res.end();
    }
});

//Deleção de album
router.delete('/homepage/deleteAlbum', async (req, res, next) => {
    if (checkSession(req.session, req.session.user)) {
        if (req.body.albumId != undefined && req.body.albumId != null && typeof (req.body.albumId) == "number") {
            const albumId = Number(req.body.albumId);
            const albumObj = new albumClass({ id: albumId, userId: req.session.userId });
            const resp = await albumObj.deleteAlbum();
            if (resp) {
                res.json({ message: "Sucesso em apagar album" });
                res.end();
            } else {
                res.json({ message: "Erro ao apagar album" });
                res.end();
            }
        } else {
            res.json({ message: "Erro na formatação, verifique" });
            res.end()
        }
    } else {
        res.json({ message: "Você não esta logado" });
        res.end();
    }
});

//Atualização de album
router.patch('/homepage/updateAlbum', async (req, res, next) => {
    if (checkSession(req.session, req.session.user)) {
        const albumId = Number(req.body.albumId);
        const albumName = req.body.albumName;
        if (albumId != undefined && typeof (albumId) === "number" && albumName != undefined && albumName != "" && typeof (albumName) === "string") {
            const albumObj = new albumClass({ name: albumName, userId: req.session.userId, id: albumId });
            const resp = await albumObj.updateAlbumName();
            if (resp) {
                res.json({ message: "Sucesso em alterar album", album: JSON.stringify(resp.rows[0]) });
                res.end();
            } else {
                res.json({ message: "Erro ao alterar album" });
                res.end();
            }
        } else {
            res.json({ message: "Verifique a formatação da sua entrada" });
            res.end();
        }
    } else {
        res.json({ message: "Você não está logado" });
        res.end();
    }

});


router.patch('/homepage/updateAlbumPreview', async (req, res, next) => {
    if (checkSession(req.session, req.session.user)) {
        const albumId = Number(req.body.albumId);
        const albumPreview = Number(req.body.albumPreview);
        if (albumId != undefined && typeof (albumId) === "number" && albumPreview != undefined && typeof (albumPreview) === "number") {
            const albumObj = new albumClass({ preview: albumPreview, id: albumId, userId: req.session.userId });
            const resp = albumObj.updateAlbumPreview();
            if (resp) {
                res.json({ message: "Sucesso em alterar preview do album", album: JSON.stringify(resp.rows[0]) });
                res.end();
            } else {
                res.json({ message: "Erro ao alterar preview do album" });
                res.end();
            }
        } else {
            res.json({ message: "Entrada de dados errada, verifique" });
            res.end();
        }
    } else {
        res.json({ message: "Você não está logado" });
        res.end();
    }
})

//Exportando o roteador
module.exports = router;