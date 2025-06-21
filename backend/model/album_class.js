const pool = require('./db');
const writeLog = require('../../logs/log_handler');

class album {
    constructor({name = null, preview = null, id = null, dbResult = null, userId = null}) {
        this.name = name;
        this.id = id;
        this.dbResult = dbResult;
        this.userId = userId;
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
            if (this.name == undefined || typeof (this.name) != "string" || this.name === "" || this.userId == undefined || typeof(this.userId) != "number") {
                throw `Formatação da entrada incorreta\nname: ${this.name} typeOf: ${typeof (this.name)}`;
            } else {
                const query = `INSERT INTO album (album_name, user_id) VALUES($1,$2) RETURNING *`;
                const values = [this.name, this.userId];
                console.log(typeof(this.name));
                this.setDbResult = await pool.query(query, values);
                if (this.dbResult.rowCount === 0) {
                    throw `Resposta ruim do banco de dados, provavelmente não encontrou os dados que estava procurando\nresultado: ${this.dbResult}`;
                }
                writeLog("\nSucesso na inseção na tabela album\nID: " + this.dbResult.rows[0].album_id);
                return this.dbResult;
            }
        } catch (err) {
            writeLog("\nErro ao inserir na tabela album\n" + err);
            return false;
        }
    }

    async deleteAlbum() {
        try {
            if (this.id === null || this.id === undefined || typeof (this.id) != "number" || this.userId === null || this.userId === undefined || typeof (this.userId) != "number") {
                throw `Formatação da entrada incorreta\nid: ${this.id} typeOf: ${typeof (this.id)} \nuserID: ${this.userId} typerOf: ${this.userId}`;
            } else {
                const query = `DELETE FROM album WHERE album_id = $1 AND user_id = $2 RETURNING *`;
                const values = [this.id, this.userId];
                this.setDbResult = await pool.query(query, values);
                if (this.dbResult.rowCount === 0) {
                    throw `Resposta ruim do banco de dados, provavelmente não encontrou os dados que estava procurando\nresultado: ${this.dbResult}`;
                }
                writeLog("\nSucesso ao deletar o album\nID: " + this.dbResult.rows[0].album_id);
                return this.dbResult;
            }
        } catch (err) {
            writeLog(`\nErro ao excluir a tabela ${this.id}\n` + err);
            return false;
        }
    }

    async updateAlbumName() {
        try {
            if (this.id === null || this.id === undefined || typeof (this.id) != "number" || this.name === null || this.name === undefined || typeof (this.name) != "string" || this.name === "" || this.userId == undefined || typeof(this.userId) != "number") {
                throw `Formatação da entrada incorreta\nname: ${this.name} typeOf: ${typeof (this.name)}\nid: ${this.id} typeOf: ${typeof (this.id)}`;
            } else {
                const query = `UPDATE album SET album_name = $1 WHERE album_id = $2 and user_id = $3 RETURNING album_id`;
                const values = [this.name, this.id, this.userId];
                this.setDbResult = await pool.query(query, values);
                if (this.dbResult.rowCount === 0) {
                    throw `Resposta ruim do banco de dados, provavelmente não encontrou os dados que estava procurando\nresultado: ${this.dbResult}`;
                }
                writeLog("\nSucesso na alteração de nome do album\nID: " + this.dbResult.rows[0].album_id);
                return this.dbResult;
            }
        } catch (err) {
            writeLog(`\nErro na alteração do album ${this.id}\n` + err);
            return false;
        }
    }

    async updateAlbumPreview() {
        try {
            if (this.id === null || this.id === undefined || typeof (this.id) != "number" || this.preview === null || this.preview === undefined || typeof (this.preview) != "number" || this.userId == undefined || typeof(this.userId) != "number") {
                throw `Formatação da entrada incorreta\nname: ${this.name} typeOf: ${typeof (this.name)}\nid: ${this.id} typeOf: ${typeof (this.id)}`;
            } else {
                const query = `UPDATE album SET album_preview = '$1' WHERE album_id = $2 and user_id = $3 RETURNING album_id`;
                const values = [this.preview, this.id, this.userId];
                this.setDbResult = await pool.query(query, values);
                if (this.dbResult.rowCount === 0) {
                    throw `Resposta ruim do banco de dados, provavelmente não encontrou os dados que estava procurando\nresultado: ${this.dbResult}`;
                }
                writeLog("\nSucesso ao atribuir preview no album\n" + this.dbResult.rows[0].album_id);
            }
        } catch (err) {
            writeLog(`\nErro ao atribuir preview do album ${this.id}\n` + err);
        }
    }

    async getAlbunsByUser() {
        try {
            if (this.userId == undefined || typeof (this.userId) != "number") {
                throw `Formatação da entrada incorreta\nUSER_ID: ${this.userId} typeOf: ${typeof (this.userId)}`;
            } else {
                const query = `select * from album inner join users on users.user_id = album.user_id where users.user_id = $1`;
                const values = [this.userId];
                this.setDbResult = await pool.query(query, values);
                if (this.dbResult.rowCount === 0) {
                    throw `Resposta ruim do banco de dados, provavelmente não encontrou os dados que estava procurando\nresultado: ${this.dbResult}`;
                }
                writeLog("\nSucesso em getAlbunsByUser\nQuantidade de albuns encontrados: " + this.dbResult.rowCount);
                return this.dbResult;
            }
        } catch (err) {
            writeLog("\nErro em getAlbunsByUser\nErro: " + err);
        }
    }
}

module.exports = album;
