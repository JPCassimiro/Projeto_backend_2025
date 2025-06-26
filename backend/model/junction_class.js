const pool = require('./db');
const writeLog = require('../../logs/log_handler');

class album_image_junction {
    constructor({ imageId = null, albumId = null, dbResult = null, userid = null }) {
        this.albumId = albumId;
        this.imageId = imageId;
        this.userid = userid;
        this.dbResult = dbResult;
    }

    set setAlbumId(id) {
        this.albumId = id;
    }

    set setImageId(id) {
        this.imageId = id;
    }

    set setDbResult(result) {
        this.dbResult = result;
    }

    get getDbResult() {
        return this.dbResult;
    }

    async insertImageIntoAlbum() {
        try {
            if (this.albumId === null || this.albumId == undefined || typeof (this.albumId) != "number" || this.imageId === null || this.imageId === undefined || typeof (this.imageId) != "number" || this.userid === undefined || this.userid === null  || typeof(this.userid) != "number") {
                throw `Formatação da entrada incorreta\nalbumId: ${this.albumId} typeOf: ${typeof (this.albumId)}\nimageId: ${this.imageId} typeOf: ${typeof (this.imageId)}\nUserId: ${this.userid} typerOf: ${typeof(this.userid)}`;
            } else {
                const query = `INSERT INTO album_image_junction (image_id, album_id, user_id) VALUES($1,$2,$3) RETURNING *`;
                const values = [this.imageId, this.albumId, this.userid];
                this.setDbResult = await pool.query(query, values);
                if (this.dbResult.rowCount === 0) {
                    throw `Resposta ruim do banco de dados, provavelmente não encontrou os dados que estava procurando\nresultado: ${JSON.stringify(this.dbResult)}`;
                }
                writeLog("\nSucesso ao inserir a imagem " + this.dbResult.rows[0].image_id + " no album " + this.dbResult.rows[0].album_id + "\n");
                return this.dbResult;
            }
        } catch (err) {
            writeLog(`\nErro ao inserir uma imagem no album ${this.albumId}\nErro: ` + err);
            return false;
        }
    }

    async removeImageFromAlbum() {
        try {
            if (this.albumId === null || this.albumId == undefined || typeof (this.albumId) != "number" || this.imageId === null || this.imageId === undefined || typeof (this.imageId) != "number" || this.userid === undefined || this.userid === null  || typeof(this.userid) != "number") {
                throw `Formatação da entrada incorreta\nalbumId: ${this.albumId} typeOf: ${typeof (this.albumId)}\nimageId: ${this.imageId} typeOf: ${typeof (this.imageId)}\nUserId: ${this.userid} typerOf: ${typeof(this.userid)}`;
            } else {
                const query = `DELETE FROM album_image_junction WHERE album_id = $1 AND image_id = $2 AND user_id = $3 RETURNING *`;
                const values = [this.albumId, this.imageId, this.userid];
                this.setDbResult = await pool.query(query, values);
                writeLog("\nSucesso ao remover imagem do album\n" + this.dbResult.rows[0].image_id);
                if (this.dbResult.rowCount === 0) {
                    throw `Resposta ruim do banco de dados, provavelmente não encontrou os dados que estava procurando\nresultado: ${JSON.stringify(this.dbResult)}`;
                }
                writeLog("\nSucesso ao remover imagem do album\nID: " + this.dbResult.rows[0].image_id);
                return this.dbResult;
            }
        } catch (err) {
            writeLog(`\nErro ao remover uma imagem no album ${this.albumId}\n` + err);
            return false;
        }
    }

    async returnImagesInAlbum() {
        try {
            if (this.albumId === null || this.albumId == undefined || typeof (this.albumId) != "number" || this.userid === undefined || this.userid === null  || typeof(this.userid) != "number") {
                throw `Formatação da entrada incorreta\nalbumId: ${this.albumId} typeOf: ${typeof (this.albumId)}\nUserId: ${this.userid} typerOf: ${typeof(this.userid)}`;
            } else {
                const query = `SELECT * FROM album_image_junction where album_id = $1 AND user_id = $2`;
                const values = [this.albumId, this.userid];
                this.setDbResult = await pool.query(query, values);
                let imageArray = [];
                this.dbResult.rows.forEach(images => {
                    imageArray.push(images.image_id);
                });
                writeLog("\nSucesso ao recuperar imagens no album\nImagens: " + imageArray);
                return this.dbResult;
            }
        } catch (err) {
            writeLog(`\nErro ao recuperar imagens no album ${this.albumId}\nErro: ` + err);
            return false;
        }
    }

}

module.exports = album_image_junction;