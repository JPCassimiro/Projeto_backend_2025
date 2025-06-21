const express = require('express');
const path = require('path');
const router = express.Router();
const imageClass = require('../model/image_class');

const checkSession = (session, user) => {
    if (session && user) {
        return true
    } else {
        return false;
    }
}

router.post("/homepage/addImage", async (req, res, next) => {
    if (checkSession(req.session, req.session.user)) {
        let path = req.body.imagePath;
        if (path == undefined || path === "") {
            res.json({message: "Erro na entrada, caminho invalido"});
            res.end();
        } else {
            path = path.replace(/\\/g, "/");
            const fileName = path.split("/");
            const imageObj = new imageClass({ name: fileName[fileName.length - 1], file: path, userId: req.session.userId });
            const resp = await imageObj.insertImage();
            if (resp) {
                res.json({message: "Sucesso em adicionar a imagem no banco de dados"});
                res.end();
            } else {
                res.json({message: "Erro ao tentar colocar imagem no banco de dados, verifique o caminho da imagem"});
                res.end();
            }
        }
    } else {
        res.json({message: "Você não esta logado, está rota é secreta"});
        res.end();
    }
});


router.get("/homepage/getImages", async (req, res, next)=>{
    if(checkSession(req.session,req.session.user)){
        const imageObj = new imageClass({userId: req.session.userId});
        const resp = await imageObj.getImagesByUser();
        if(resp){
            res.json({message:"certo"})
            res.end();
        }else{
            res.json({message:"errado"})
            res.end();
        }
    }else{
        res.json({message: "Você não esta logado, está rota é secreta"});
        res.end();
    }
});


router.delete("/homepage/deleteImage", async (req, res, next) => {
    if(checkSession(req.session, req.session.user)){
        if (req.body.imageId != undefined || req.body.imageId != null || typeof(req.body.imageId) == "number") {
            const imageID = req.body.imageId;
            const imageObj = new imageClass({userId: req.session.userId, id: imageID});
            const resp = await imageObj.deleteImage();
            if(resp){
                res.json({ message: "Sucesso em apagar imagem" });
                res.end();
            } else {
                res.json({ message: "Erro ao apagar imagem" });
                res.end();
            }
        }else{
            res.json({ message: "Erro na formatação, verifique" });
            res.end()
        }
    }else{
        res.json({ message: "Você não esta logado" });
        res.end();
     
    }
})

module.exports = router;