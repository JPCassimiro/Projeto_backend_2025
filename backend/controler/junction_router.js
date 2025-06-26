const express = require('express');
const path = require('path');
const router = express.Router();
const junctionClass = require('../model/junction_class');
const writeLog = require('../../logs/log_handler');

const checkSession = (session, user, route) => {
    if (session && user) {
        writeLog(`\nUsuário tentou acessar uma rota protegida\nrota: ${route}`);
        return true
    } else {
        return false;
    }
}

//Adicionando imagem a um album
router.post('/homepage/addImageInAlbum', async (req, res, next) => {
    if (checkSession(req.session, req.session.user, '/homepage/addImageInAlbum')) {
        const userId = req.session.userId;
        const albumId = Number(req.body.albumId);
        const imageId = Number(req.body.imageId);
        const junctionObj = new junctionClass({ imageId: imageId, albumId: albumId, userid: userId });
        const resp = await junctionObj.insertImageIntoAlbum();
        if (resp) {
            res.json({ message: "Sucesso em adicionar imagem ao album" });
            writeLog(`\nSucesso em adicionar uma imagem em um album na rota /homepage/addImageInAlbum\nimage_id: ${resp.rows[0].image_id} userId: ${req.session.userId} album_id: ${resp.rows[0].album_id}`);
            res.end();
        } else {
            res.status(400).json({
                message: "Erro ao inserir imagem no álbum. Isso pode ocorrer caso a formatação da entrada esteja errada ou por um erro interno no banco de dados.",
                parametrosEsperados: {
                    albumId: "number",
                    imageId: "number",
                },
                bodyType: "form-urlencoded"
            });
            res.end();
            writeLog(`\nFalha em adicionar uma imagem em um album na rota /homepage/addImageInAlbum\nuserId: ${req.session.userId}`);
        }
    } else {
        res.json({ message: "Você não esta logado" });
        res.end();
    }
});

//Pegando todas as imagens em um album
router.get('/homepage/getImagesInAlbum', async (req, res, next) => {
    if (checkSession(req.session, req.session.user, '/homepage/getImagesInAlbum')) {
        const userId = Number(req.session.userId);
        const albumId = Number(req.body.albumId);
        const junctionObj = new junctionClass({ userid: userId, albumId: albumId });
        const resp = await junctionObj.returnImagesInAlbum();
        if (resp) {
            res.json({ message: "Sucesso em retornar imagens em um album", imagens: JSON.stringify(resp.rows) });
            writeLog(`\nSucesso em obter as imagens de um album na rota /homepage/addImageInAlbum\nuserId: ${req.session.userId} \nimagens: ${JSON.stringify(resp.rows)}`);
            res.end();
        } else {
            res.status(400).json({
                message: "Erro ao retornar imagens no album. Isso pode ocorrer caso a formatação da entrada esteja errada ou por um erro interno no banco de dados.",
                parametrosEsperados: {
                    albumId: "number",
                },
                bodyType: "form-urlencoded"
            });
            writeLog(`\nFalha em retornar imagens de um album na rota /homepage/getImagesInAlbum\nuserId: ${req.session.userId}`);
            res.end();
        }
    } else {
        res.json({ message: "Você não esta logado" });
        res.end();
    }
});

//Removendo uma imagem de um album
router.delete('/homepage/removeImageFromAlbum', async (req, res, next) => {
    if (checkSession(req.session, req.session.user, '/homepage/removeImageFromAlbum')) {
        const userId = req.session.userId;
        const albumId = Number(req.body.albumId);
        const imageId = Number(req.body.imageId);
        const junctionObj = new junctionClass({ userid: userId, albumId: albumId, imageId: imageId });
        const resp = await junctionObj.removeImageFromAlbum();
        if (resp) {
            res.json({ message: "Sucesso em remover imagem do  album", albuns: JSON.stringify(resp.rows) });
            writeLog(`\nSucesso em remover uma imagem em um album na rota /homepage/addImageInAlbum\nimage_id: ${resp.rows[0].image_id} userId: ${req.session.userId} album_id: ${resp.rows[0].album_id}`);
            res.end();
        } else {
            res.status(400).json({
                message: "Erro ao remover uma imagem no album. Isso pode ocorrer caso a formatação da entrada esteja errada ou por um erro interno no banco de dados.",
                parametrosEsperados: {
                    albumId: "number",
                    imageId: "number",
                },
                bodyType: "form-urlencoded"
            });
            writeLog(`\nFalha em remover uma imagem de um album na rota /homepage/removeImageFromAlbum\nuserId: ${req.session.userId}`);
            res.end();
        }
    } else {
        res.json({ message: "Você não esta logado" });
        res.end();
    }
});

//Exportando o roteador
module.exports = router;