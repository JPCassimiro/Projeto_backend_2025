const express = require('express');
const path = require('path');
const router = express.Router();
const albumClass = require('../model/album_class');


//Criação de albuns
router.post('/homepage/createAlbum',async (req, res, next) => {
    if(req.body.albumName != undefined || req.body.albumName != ""){
        const albumName = req.body.albumName;
        const albumObj = new albumClass(albumName, null, 0, null, 0);
        const resp = await albumObj.createAlbum();
    }
});

//Renderização da página de criação de album
router.get('/homepage/createAlbum', (req, res, next) => {
    /*if(req.session && req.session.user){
         res.render('../view/createAlbum', {});
    }else{
        res.redirect('/users/login');
    }*/
    res.render('../view/createAlbum', {});
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
router.delete('homepage/deleteAlbum',async (req, res, next) => {
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