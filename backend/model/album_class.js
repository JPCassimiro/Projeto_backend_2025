const pool = require('./db');
const writeLog = require('../../logs/log_handler');

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
                const query = `INSERT INTO album (album_name) VALUES('$1') RETURNING *`;
                const values = [this.name];
                const res = await pool.query(query, values);
                this.setDbResult = res;
                writeLog("\nSucesso na inseção na tabela album\nID: " + this.dbResult.rows[0].album_id);
            }
        } catch (err) {
            writeLog("\nErro ao inserir na tabela album\n" + err);
        }
    }

    async deleteAlbum() {
        try {
            if (this.id === null || this.id === undefined || typeof (this.id) != "number") {
                throw `Formatação da entrada incorreta\nid: ${this.id} typeOf: ${typeof(this.id)}`;
            } else {
                const query = `DELETE FROM album WHERE album_id = $1 RETURNING *`;
                const values = [this.id];
                this.setDbResult = await pool.query(query, values);
                writeLog("\nSucesso ao deletar o album\nID: " + this.dbResult.rows[0].album_id);
            }
        } catch (err) {
            writeLog(`\nErro ao excluir a tabela ${this.id}\n` + err);
        }
    }

    async updateAlbumName() {
        try {
            if (this.id === null || this.id === undefined || typeof (this.id) != "number" || this.name === null || this.name === undefined || typeof (this.name) != "string" || this.name === "") {
                throw `Formatação da entrada incorreta\nname: ${this.name} typeOf: ${typeof(this.name)}\nid: ${this.id} typeOf: ${typeof(this.id)}`;
            } else {
                const query = `UPDATE album SET album_name = '$1' WHERE album_id = $2 RETURNING album_id`;
                const values = [this.name, this.id]; 
                const res = await pool.query(query, values);
                this.setDbResult = res;
                writeLog("\nSucesso na alteração de nome do album\nID: " + this.dbResult.rows[0].album_id);
            }
        } catch (err) {
            writeLog(`\nErro na alteração do album ${this.id}\n` + err);
        }
    }

    async updateAlbumPreview() {
        try {
            if (this.id === null || this.id === undefined || typeof (this.id) != "number" || this.preview === null || this.preview === undefined || typeof (this.preview) != "number") {
                throw `Formatação da entrada incorreta\nname: ${this.name} typeOf: ${typeof(this.name)}\nid: ${this.id} typeOf: ${typeof(this.id)}`;
            } else {
                const query = `UPDATE album SET album_preview = '$1' WHERE album_id = $2 RETURNING album_id`;
                const values = [this.preview, this.id];
                const res = await pool.query(query, values);
                this.setDbResult = res;
                writeLog("\nSucesso ao atribuir preview no album\n" + this.dbResult.rows[0].album_id);
            }
        } catch (err) {
            writeLog(`\nErro ao atribuir preview do album ${this.id}\n` + err);
        }
    }
}

const albumObj = new album();
