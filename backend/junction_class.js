const pool = require('./db');
const writeLog = require('../logs/log_handler');

class album_image_junction {
    constructor(imageId = null, albumId = null, dbResult = null) {
        this.albumId = albumId;
        this.imageId = imageId;
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
            if (this.albumId === null || this.albumId == undefined || typeof (this.albumId) != "number" || this.imageId === null || this.imageId === undefined || typeof (this.imageId) != "number") {
                throw `Formatação da entrada incorreta\nalbumId: ${this.albumId} typeOf: ${typeof (this.albumId)}\nimageId: ${this.imageId} typeOf: ${typeof (this.imageId)}`;
            } else {
                const query = `INSERT INTO album_image_junction (image_id, album_id) VALUES($1,$2) RETURNING *`;
                const values = [this.imageId, this.albumId];
                this.setDbResult = await pool.query(query, values);
                writeLog("\nSucesso ao inserir a imagem " + this.dbResult.rows[0].image_id + " no album " + this.dbResult.rows[0].album_id + "\n");
            }
        } catch (err) {
            writeLog(`\nErro ao inserir uma imagem no album ${this.albumId}\n` + err);
        }
    }

    async removeImageFromAlbum() {
        try {
            if (this.albumId === null || this.albumId == undefined || typeof (this.albumId) != "number" || this.imageId === null || this.imageId === undefined || typeof (this.imageId) != "number") {
                throw `Formatação da entrada incorreta\nalbumId: ${this.albumId} typeOf: ${typeof (this.albumId)}\nimageId: ${this.imageId} typeOf: ${typeof (this.imageId)}`;
            } else {
                const query = `DELETE FROM album_image_junction WHERE album_id = $1 and image_id = $2 RETURNING *`;
                const values = [this.albumId, this.imageId];
                this.setDbResult = await pool.query(query, values);
                writeLog("\nSucesso ao remover imagem do album\n" + this.dbResult.rows[0].image_id);
            }
        } catch (err) {
            writeLog(`\nErro ao remover uma imagem no album ${this.albumId}\n` + err);
        }
    }

    async returnImagesInAlbum() {
        try {
            if (this.albumId === null || this.albumId == undefined || typeof (this.albumId) != "number") {
                throw `Formatação da entrada incorreta\nalbumId: ${this.albumId} typeOf: ${typeof (this.albumId)}`;
            } else {
                const query = `SELECT * FROM album_image_junction where album_id = $1`;
                const values = [this.albumId];
                this.setDbResult = await pool.query(query, values);
                let imageArray = new Array();
                this.dbResult.rows.forEach(images => {
                    imageArray.push(images.image_id);
                });
                writeLog("\nImagens no album\n" + imageArray);
            }
        } catch (err) {
            writeLog(`\nErro ao recuperar imagens no album ${this.albumId}\n` + err);
        }
    }
}

const album_image_junctionObj = new album_image_junction(10,6);

album_image_junctionObj.returnImagesInAlbum();