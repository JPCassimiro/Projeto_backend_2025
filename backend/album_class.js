const pool = require('./db');
const writeLog = require('../logs/log_handler');

class album {
    constructor(name = null, preview = null, id = null, dbResult = null) {
        this.name = name;
        this.id = id;
        this.dbResult = dbResult;
        this.preview = preview;
    }

    set setAlbumName(name) {
        this.name = name;
    }

    set setAlbumId(id) {
        this.id = id;
    }

    set setAlbumPreview(preview) {
        this.preview = preview;
    }

    set setDbResult(result) {
        this.dbResult = result;
    }

    get getDbResult() {
        return this.dbResult;
    }

    async createAlbum() {
        try {
            if (this.name === null || this.name === undefined || typeof (this.name) != "string" || this.name === "") {
                throw `Formatação da entrada incorreta\nname: ${this.name} typeOf: ${typeof(this.name)}`;
            } else {
                const query = `INSERT INTO album (album_name) VALUES('${this.name}')`;
                const res = await pool.query(query);
                this.setDbResult = res;
                writeLog("\nSucesso na inseção na tabela album\n " + JSON.stringify(this.dbResult));
            }
        } catch (err) {
            writeLog("\nErro ao inserir na tabela album\n" + err);
        }
    }

    async deleteAlbum() {
        try {
            if (this.id === null || this.id === undefined || typeof (this.id) != "Number") {
                throw `Formatação da entrada incorreta\nid: ${this.id} typeOf: ${typeof(this.id)}`;
            } else {
                const query = `DELETE FROM album WHERE album_id = '${this.id} RETURNING *'`;
                this.setDbResult = await pool.query(query);
                writeLog("\nSucesso ao deletar o album\n" + this.dbResult);
            }
        } catch (err) {
            writeLog(`\nErro ao exlcuir a tabela ${this.id}\n` + err);
        }
    }

    async updateAlbumName() {
        try {
            if (this.id === null || this.id === undefined || typeof (this.id) != "Number" || this.name === null || this.name === undefined || typeof (this.name) != "string" || this.name === "") {
                throw `Formatação da entrada incorreta\nname: ${this.name} typeOf: ${typeof(this.name)}\nid: ${this.id} typeOf: ${typeof(this.id)}`;
            } else {
                const query = `UPDATE FROM album SET album_name = '${this.name}' WHERE album_id = '${this.id}' RETURNING album_id`;
                const res = pool.query(query);
                this.setDbResult(res);
                writeLog("\nSucesso na alteração de nome do album\n" + JSON.stringify(this.dbResult));
            }
        } catch (err) {
            writeLog("\nErro na alteração do album\n" + err);
        }
    }

    async updateAlbumPreview() {
        try {
            if (this.id === null || this.id === undefined || typeof (this.id) != "Number" || this.preview === null || this.preview === undefined || typeof (this.preview) != "Number") {
                throw `Formatação da entrada incorreta\nname: ${this.name} typeOf: ${typeof(this.name)}\nid: ${this.id} typeOf: ${typeof(this.id)}`;
            } else {
                const query = `UPDATE FROM album SET album_preview = '${this.preview}' WHERE album_id = '${this.id}' RETURNING album_id`;
                const res = pool.query(query);
                this.setDbResult(res);
                writeLog("\nSucesso ao atribuir preview no album\n" + JSON.stringify(this.dbResult));
            }
        } catch (err) {
            writeLog("\nErro ao atribuir preview do album\n" + err);
        }
    }
}

const albumObj = new album();

albumObj.createAlbum();
albumObj.deleteAlbum();
albumObj.updateAlbumName();
albumObj.updateAlbumPreview();