const pool = require('./db');

class album_image_junction {
    constructor(imageId = null, albumId = null, dbResult = null) {
        this.albumId = albumId;
        this.imageId = imageId;
        this.dbResult = dbResult;
    }

    set setAlbumId(id){
        this.albumId = id;
    }

    set setImageId(id){
        this.imageId = id;
    }

    set setDbResult(result){
        this.dbResult = result;
    }

    get getDbResult(){
        return this.dbResult;
    }

    async insertImageIntoAlbum() {
        try {
            const query = `INSERT INTO album_image_junction (image_id, album_id) VALUES('${this.imageId}',${this.albumId}) RETURNING image_id`;
            this.setDbResult = await pool.query(query);
        } catch (err) {
            console.log("Erro ao inserir uma imagem em um album: " + JSON.stringify(err));
        }
    }

    async removeImageFromAlbum() {
        try {
            const query = `DELETE FROM album_image_junction WHERE album_id = '${this.albumId}' and image_id = '${this.imageId}'`;
            await pool.query(query);
        } catch (err) {
            console.log("Erro ao remover uma imagem em um album: " + JSON.stringify(err));
        }
    }

    async returnImagesInAlbum() {
        try {
            const query = `SELECT * FROM album_image_junction where album_id = '${this.albumId}'`;
            this.setDbResult = await pool.query(query);
            console.log("Imagens no album: " + this.dbResult.rows);
        } catch (err) {
            console.log("Erro ao recuperar imagens no album: " + err);
        }
    }
}