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
                res.status(200).json({ message: "Sucesso em criar album" });
                res.end();
                writeLog(`\nSucesso na criação de album na rota /homepage/createAlbum\nalbum_id: ${resp.rows[0].album_id} userId: ${req.session.userId}`);
            } else {
                res.status(500).json({ message: "Erro ao interno criar album" });
                res.end();
                writeLog(`\nErro na criação de album na rota /homepage/createAlbum\nuserId: ${req.session.userId} \nsession: ${req.session.id}`);
            }
        } else {
            res.status(400).json({
                message: "Erro ao criar um álbum. Formatação da entrada errada.",
                parametrosEsperados: {
                    albumName: "string",
                },
                bodyType: "form-urlencoded"
            });
            res.end();
            writeLog(`\nErro na criação de album na rota /homepage/createAlbum\nuserId: ${req.session.userId} \nsession: ${req.session.id}`);
        }
    } else {
        res.status(403).json({ message: "Você não esta logado" });
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
            res.status(200).json({ message: "Sucesso em retornar albums", albuns: JSON.stringify(resp.rows) });
            res.end();
        } else {
            writeLog(`\nErro ao tentar buscar albuns na rota /homepage/getUserAlbuns\nuserId: ${req.session.userId}`);
            res.status(400).json({
                message: "Erro ao retornar álbuns. Isso pode ocorrer caso a formatação da entrada esteja errada ou por um erro interno no banco de dados.",
                parametrosEsperados: {
                },
                bodyType: "form-urlencoded"
            });
            res.end();
        }
    } else {
        res.status(403).json({ message: "Você não esta logado" });
        res.end();
    }
});

//Deleção de album
router.delete('/homepage/deleteAlbum', async (req, res, next) => {
    writeLog(`\nRequisição delete na rota /homepage/deleteAlbum`);
    if (checkSession(req.session, req.session.user, '/homepage/deleteAlbum')) {
        if (req.body.albumId != undefined && req.body.albumId != null) {
            const albumId = Number(req.body.albumId);
            const albumObj = new albumClass({ id: albumId, userId: req.session.userId });
            const resp = await albumObj.deleteAlbum();
            if (resp) {
                res.status(200).json({ message: "Sucesso em apagar album" });
                res.end();
                writeLog(`\nSucesso em apagar albuns na rota /homepage/getUserAlbuns\nuserId: ${req.session.userId}\nalbum_id: ${resp.rows[0].album_id}`);
            } else {
                res.status(500).json({ message: "Erro interno ao excluir album" });
                res.end();
                writeLog(`\nErro ao tentar apagar um album na rota /homepage/getUserAlbuns\nuserId: ${req.session.userId}`);
            }
        } else {
            res.status(400).json({
                message: "Erro ao excluir um álbum. Isso pode ocorrer caso a formatação da entrada esteja errada ou por um erro interno no banco de dados.",
                parametrosEsperados: {
                    albumId: "number",
                },
                bodyType: "form-urlencoded"
            });
            res.end();
            writeLog(`\nErro ao tentar apagar um album na rota /homepage/getUserAlbuns\nuserId: ${req.session.userId}`);
        }
    } else {
        res.status(403).json({ message: "Você não esta logado" });
        res.end();
    }
});

//Atualização de album
router.patch('/homepage/updateAlbum', async (req, res, next) => {
    writeLog(`\nRequisição patch na rota /homepage/updateAlbum`);
    if (checkSession(req.session, req.session.user, '/homepage/updateAlbum')) {
        const albumId = Number(req.body.albumId);
        const albumName = req.body.albumName;
        if (albumId != undefined && albumName != undefined && albumName != "" && typeof (albumName) === "string") {
            const albumObj = new albumClass({ name: albumName, userId: req.session.userId, id: albumId });
            const resp = await albumObj.updateAlbumName();
            if (resp) {
                res.status(200).json({ message: "Sucesso em alterar album", album: JSON.stringify(resp.rows[0]) });
                res.end();
                writeLog(`\nSucesso em alterar um album na rota /homepage/updateAlbum\nuserId: ${req.session.userId}\nalbum_id: ${resp.rows[0].album_id}`);
            } else {
                res.status(500).json({message: "Erro ao alterar um álbum. Erro interno no banco de dados."});
                res.end();
                writeLog(`\nErro ao tentar alterar um album na rota /homepage/updateAlbum\nuserId: ${req.session.userId}`);
            }
        } else {
            res.status(400).json({
                message: "Erro ao alterar um álbum. Formatação da entrada errada.",
                parametrosEsperados: {
                    albumId: "number",
                    albumName: "string",
                },
                bodyType: "form-urlencoded"
            });
            res.end();
            writeLog(`\nErro ao tentar alterar um album na rota /homepage/updateAlbum\nuserId: ${req.session.userId}`);
        }
    } else {
        res.status(403).json({ message: "Você não está logado" });
        res.end();
    }
});

router.patch('/homepage/updateAlbumPreview', async (req, res, next) => {
    writeLog(`\nRequisição patch na rota /homepage/updateAlbumPreview`);
    if (checkSession(req.session, req.session.user, '/homepage/updateAlbumPreview')) {
        const albumId = Number(req.body.albumId);
        const albumPreview = Number(req.body.albumPreview);
        if (albumId != undefined && albumPreview != undefined) {
            const albumObj = new albumClass({ preview: albumPreview, id: albumId, userId: req.session.userId });
            const resp = await albumObj.updateAlbumPreview();
            if (resp) {
                res.status(200).json({ message: "Sucesso em alterar preview do album", album: JSON.stringify(resp.rows[0]) });
                res.end();
                writeLog(`\nSucesso em alterar um album na rota /homepage/updateAlbumPreview\nuserId: ${req.session.userId}\nalbum_id: ${resp.rows[0].album_id}`);
            } else {
                res.status(500).json({message: "Erro ao alterar um álbum. Erro interno no banco de dados."});
                res.end();
                writeLog(`\nErro ao tentar alterar um album na rota /homepage/updateAlbumPreview\nuserId: ${req.session.userId}`);
            }
        } else {
            res.status(400).json({
                message: "Erro ao alterar um álbum. Formatação da entrada errada.",
                parametrosEsperados: {
                    albumId: "number",
                    albumName: "string",
                    albumPreview: "number"
                },
                bodyType: "form-urlencoded"
            });
            res.end();
            writeLog(`\nErro ao tentar alterar um album na rota /homepage/updateAlbumPreview\nuserId: ${req.session.userId}`);
        }
    } else {
        res.status(403).json({ message: "Você não está logado" });
        res.end();
    }
})

//Exportando o roteador
module.exports = router;