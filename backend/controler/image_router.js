const express = require('express');
const path = require('path');
const router = express.Router();
const imageClass = require('../model/image_class');
const writeLog = require('../../logs/log_handler');

const checkSession = (session, user, route) => {
    if (session && user) {
        writeLog(`\nUsuário tentou acessar uma rota protegida\nrota: ${route}`);
        return true
    } else {
        return false;
    }
}

router.post("/homepage/addImage", async (req, res, next) => {
    writeLog("\nRequisisção post recebida na rota /homepage/addImage");
    if (checkSession(req.session, req.session.user, "/homepage/addImage")) {
        let path = req.body.imagePath;
        if (path == undefined || path === "") {
            res.status(400).json({
                message: "Erro ao inserir imagem no banco. Formatação da entrada errada.",
                parametrosEsperados: {
                    imagePath: "string",
                },
                bodyType: "form-urlencoded"
            });
            res.end();
        } else {
            path = path.replace(/\\/g, "/");
            const fileName = path.split("/");
            const imageObj = new imageClass({ name: fileName[fileName.length - 1], file: path, userId: req.session.userId });
            const resp = await imageObj.insertImage();
            if (resp) {
                res.status(200).json({ message: "Sucesso em adicionar a imagem no banco de dados" });
                res.end();
                writeLog(`\nSucesso em adicionar uma imagem na rota /homepage/addImage\nimage_id: ${resp.rows[0].image_id} userId: ${req.session.userId}`);
            } else {
                res.status(500).json({ message: "Erro interno no servidor" });
                res.end();
                writeLog(`\nFalha em adicionar uma imagem na rota /homepage/addImage\nuserId: ${req.session.userId}`);
            }
        }
    } else {
        res.status(403).json({ message: "Você não esta logado" });
        res.end();
    }
});


router.get("/homepage/getImages", async (req, res, next) => {
    writeLog("\nRequisisção get recebida na rota /homepage/getImages");
    if (checkSession(req.session, req.session.user, "/homepage/getImages")) {
        const imageObj = new imageClass({ userId: req.session.userId });
        const resp = await imageObj.getImagesByUser();
        if (resp) {
            res.status(200).json({ message: "Sucesso em obter imagens, verifique a pasta downloaded_images" })
            res.end();
            writeLog(`\nSucesso em obter imagens /homepage/getImages\nuserId: ${req.session.userId}`);
        } else {
            res.status(500).json({ message: "Erro interno no servidor" });
            res.end();
            writeLog(`\nFalha em obter imagens /homepage/getImages\nuserId: ${req.session.userId}`);
        }
    } else {
        res.status(403).json({ message: "Você não esta logado" });
        res.end();
    }
});


router.delete("/homepage/deleteImage", async (req, res, next) => {
    writeLog("\nRequisisção delete recebida na rota /homepage/deleteImage");
    if (checkSession(req.session, req.session.user, "/homepage/deleteImage")) {
        if (req.body.imageId != undefined || req.body.imageId != null || typeof (req.body.imageId) == "number") {
            const imageId = Number(req.body.imageId);
            const imageObj = new imageClass({ userId: req.session.userId, id: imageId });
            const resp = await imageObj.deleteImage();
            if (resp) {
                res.status(200).json({ message: "Sucesso em apagar imagem" });
                res.end();
                writeLog(`\nSucesso em excluir a imagem /homepage/deleteImage\nimage_id: ${resp.rows[0].image_id}\nuserId: ${req.session.userId}`);
            } else {
                res.status(500).json({ message: "Erro ao apagar imagem" });
                res.end();
                writeLog(`\nFalha em excluir a imagem /homepage/deleteImage\nuserId: ${req.session.userId}`);
            }
        } else {
            res.status(400).json({
                message: "Erro ao excluir uma imagem no banco. Formatação da entrada esteja errada.",
                parametrosEsperados: {
                    imageId: "number",
                },
                bodyType: "form-urlencoded"
            });
            res.end()
            writeLog(`\nFalha em excluir a imagem /homepage/deleteImage\nuserId: ${req.session.userId}`);
        }
    } else {
        res.status(403).json({ message: "Você não esta logado" });
        res.end();
    }
})

module.exports = router;