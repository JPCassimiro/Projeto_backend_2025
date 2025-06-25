const express = require('express');
const path = require('path');
const router = express.Router();
const junctionClass = require('../model/junction_class');

const checkSession = (session, user) => {
    if (session && user) {
        return true
    } else {
        return false;
    }
}

//Adicionando imagem a um album
router.post('/homepage/addImageInAlbum', async (req,res,next) => {
    if(checkSession(req.session, req.session.user)){
       const userId = req.session.userId;
       const albumId = req.body.albumId;
       const imageId = req.body.imageId;
       const junctionObj = new junctionClass({imageId: imageId, albumId: albumId, userid: userId});
       const resp = await junctionObj.insertImageIntoAlbum();
       if(resp){
            res.json({ message: "Sucesso em adicionar imagem ao album" });
            res.end();
       }else{
            res.json({ message: "Erro ao criar album" });
            res.end();
       }
    }else{
        res.json({ message: "Você não esta logado" });
        res.end();
    }
});

//Pegando todas as imagens em um album
router.get('/homepage/getImagesInAlbum', async (req, res, next) =>{
    if(checkSession(req.session, req.session.user)){
        const userId = req.session.userId;
        const albumId = req.body.albumId;
        const junctionObj = new junctionClass({ userid: userId, albumId: albumId});
        const resp = await junctionObj.returnImagesInAlbum();
        if(resp){
            res.json({ message: "Sucesso em retornar imagens em um album", albuns: JSON.stringify(resp.rows) });
            res.end();
        }else{
            res.json({ message: "Erro ao retornar imagens em um album" });
            res.end();
        }
    }else{
        res.json({ message: "Você não esta logado" });
        res.end();
    }
});

//Removendo uma imagem de um album
router.delete('/homepage/removeImageFromAlbum', async (req, res, next) =>{
    if(checkSession(req.session, req.session.user)){
        const userId = req.session.userId;
        const albumId = req.body.albumId;
        const imageId = req.body.imageId;
        const junctionObj = new junctionClass({ userid: userId, albumId: albumId, imageId: imageId});
        const resp = await junctionObj.removeImageFromAlbum();
        if(resp){
            res.json({ message: "Sucesso em remover imagem do  album", albuns: JSON.stringify(resp.rows) });
            res.end();
        }else{
            res.json({ message: "Erro ao remover imagem do albuns" });
            res.end();
        }
    }else{
        res.json({ message: "Você não esta logado" });
        res.end();
    }
});

//Exportando o roteador
module.exports = router;