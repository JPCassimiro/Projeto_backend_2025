const pool = require('./db');

class album {
    constructor(name = null, preview = null, id = null, dbResult = null) {
        this.name = name;
        this.id = id;
        this.dbResult = dbResult;
        this.preview = preview;
    }

    set setAlbumName(name){
        this.name = name;
    }

    set setAlbumId(id){
        this.id = id;
    }

    set setAlbumPreview(preview){
        this.preview = preview;
    }

    set setDbResult(result){
        this.dbResult = result;
    }

    get getDbResult(){
        return this.dbResult;
    }

    async createAlbum() {
        try {
            const query = `INSERT INTO album (album_name) VALUES('${this.name}')`;
            const res =  await pool.query(query);
            this.setDbResult = res;
            console.log("\nSucesso na inseção na tabela album: " + JSON.stringify(this.dbResult));
        } catch (err) {
            console.log("\nErro ao inserir na tabela album: " + err);
        }
    }

    async deleteAlbum() {
        try {
            const query = `DELETE FROM album WHERE album_id = '${this.id} RETURNING album_name'`;
            const res =  await pool.query(query);
            this.setDbResult(res);
            console.log("\nSucesso ao deletar o album: " + this.dbResult);
        } catch (err) {
            console.log(`\nErro ao exlcuir a tabela ${this.id}: ` + JSON.stringify(err));
        }
    }

    async updateAlbumName() {
        try {
            const query = `UPDATE FROM album SET album_name = '${this.name}' WHERE album_id = '${this.id}' RETURNING album_id`;
            const res =  pool.query(query);
            this.setDbResult(res);
            console.log("Sucesso na alteração de nome do album: " + JSON.stringify(this.dbResult));
        } catch (err) {
            console.log("Erro na alteração do album: " + JSON.stringify(err));
        }
    }

        async updateAlbumPreview() {
        try {
            const query = `UPDATE FROM album SET album_preview = '${this.preview}' WHERE album_id = '${this.id}' RETURNING album_id`;
            const res =  pool.query(query);
            this.setDbResult(res);
            console.log("Sucesso ao atribuir preview no album: " + JSON.stringify(this.dbResult));
        } catch (err) {
            console.log("Erro ao atribuir preview do album: " + JSON.stringify(err));
        }
    }
}

