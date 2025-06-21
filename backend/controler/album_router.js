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
        if (req.body.albumName != undefined || req.body.albumName != "") {
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
router.get('homepage/getUserAlbuns', async (req, res, next) => {
    const userID = req.body.userID;
    const albumObj = new albumClass(null, null, 0, null, userID);
    const resp = await albumObj.getAlbunsByUser();
});

//Renderização da página de deleção de albuns
//Renderizar na página um botão ao lado do album para excluir

//Deleção de album
router.delete('homepage/deleteAlbum', async (req, res, next) => {
    const albumID = req.body.albumID;
    const albumObj = new albumClass(null, null, albumID, null, 0);
    const resp = await albumObj.deleteAlbum();
});

//Atualização de album
router.patch('homepage/updateAlbum', async (req, res, next) => {
    const albumID = req.body.albumID;
    const albumObj = new albumClass(null, null, albumID, null, 0);
    const resp = await albumObj.updateAlbumName();
});

//Exportando o roteador
module.exports = router;