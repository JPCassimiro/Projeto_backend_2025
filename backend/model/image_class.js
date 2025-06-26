const pool = require('./db');
const writeLog = require('../../logs/log_handler');
const fs = require('fs');
class image {
    constructor({name = null, id = null, file = null, dbResult = null, userId = null}) {
        this.name = name;
        this.id = id;
        this.file = file;
        this.userId = userId;
        this.dbResult = dbResult;
    }

    set setImageName(name) {
        this.name = name;
    }

    set setImageID(id) {
        this.id = id;
    }

    set setImageFile(file) {
        this.file = file;
    }

    set setDbResult(dbResult) {
        this.dbResult = dbResult
    }

    get getDbResult() {
        return this.dbResult;
    }

    async insertImage() {
        try {
            if (this.name == undefined || typeof (this.name) != "string" || this.name === "" || this.userId == undefined || typeof (this.userId) != "number") {
                throw `Formatação de entrada incorreta\nName: ${this.name} Type: ${typeof (this.name)}\nUSERID: ${this.userId} type: ${typeof (this.userId)} \n`;
            } else {
                const fileBuffer = Buffer.isBuffer(this.file) ? this.file : fs.readFileSync(this.file);
                const query = `INSERT INTO image (image_name, image_file, user_id) VALUES($1, $2, $3) RETURNING image_id`;
                const values = [this.name, fileBuffer, this.userId];
                this.setDbResult = await pool.query(query, values);
                if (this.dbResult.rowCount === 0) {
                    throw `Resposta ruim do banco de dados, provavelmente não encontrou os dados que estava procurando\nresultado: ${JSON.stringify(this.dbResult)}`;
                }
                writeLog("\nSucesso em inserir imagem no BD\nimage_id:" + this.dbResult.rows[0].image_id);
                return this.dbResult;
            }
        } catch (err) {
            writeLog("\nErro ao salvar imagem!\nErro: " + err);
            return false;
        }
    }

    //fins de testes internos
    async searchImage() {
        try {
            if (this.id == undefined || typeof (this.id) != "number") {
                throw `Formatação da entrada incorreta\nID: ${this.id} typeOf: ${typeof (this.id)}`;
            } else {
                const query = `SELECT * from image where image_id = $1`;
                const values = [this.id];
                this.setDbResult = await pool.query(query, values);
                if (this.dbResult.rowCount === 0) {
                    throw `Resposta ruim do banco de dados, provavelmente não encontrou os dados que estava procurando\nresultado: ${JSON.stringify(this.dbResult)}`;
                }
                fs.writeFileSync(`downloaded_images/${this.dbResult.rows[0].image_name}`, this.dbResult.rows[0].image_file);
                writeLog("\nImagem encontrada com sucesso!\n" + this.dbResult.rows[0].image_name);
                return this.dbResult;
            }
        } catch (err) {
            writeLog("\nImagem não encontrada!\n" + err);
            return false;
        }
    }

    async deleteImage() {
        try {
            if (this.id == undefined || typeof (this.id) != "number" || this.userId == undefined || typeof (this.userId) != "number") {
                throw `Formatação da entrada incorreta\nID: ${this.id} typeOf: ${typeof (this.id)}\nID de usuário: ${this.userId} typeOf: ${typeof (this.userId)}`;
            } else {
                const query = `DELETE from image where image_id = $1 AND user_id = $2 RETURNING *`;
                const values = [this.id, this.userId];
                this.setDbResult = await pool.query(query, values);
                if (this.dbResult.rowCount === 0) {
                    throw `Resposta ruim do banco de dados, provavelmente não encontrou os dados que estava procurando\nresultado: ${JSON.stringify(this.dbResult)}`;
                }
                writeLog("\nImagem apagada com sucesso!\nID: " + this.dbResult.rows[0].image_id);
                return this.dbResult;
            }
        } catch (err) {
            writeLog(`\nA imagem ${this.id} não pôde ser apagada!\n` + err);
            return false;
        }
    }

    async getImagesByUser() {
        try {
            if (this.userId == undefined || typeof (this.userId) != "number") {
                throw `Formatação da entrada incorreta\nUSER_ID: ${this.userId} typeOf: ${typeof (this.userId)}`;
            } else {
                const query = `select * from image inner join users on users.user_id = image.user_id where users.user_id = $1 `;
                const values = [this.userId];
                this.setDbResult = await pool.query(query, values);
                if (this.dbResult.rowCount === 0) {
                    throw `Resposta ruim do banco de dados, provavelmente não encontrou os dados que estava procurando\nresultado: ${JSON.stringify(this.dbResult)}`;
                }
                if(!fs.existsSync(`downloaded_images/user_${this.dbResult.rows[0].user_id}`)){
                    fs.mkdirSync(`downloaded_images/user_${this.dbResult.rows[0].user_id}`);
                }
                this.dbResult.rows.forEach(element => {
                    fs.writeFileSync(`downloaded_images/user_${element.user_id}/${element.image_name}`, element.image_file);
                });
                writeLog("\nSucesso ao procurar imagens de usuário\nQuantidade de imagens encontradas: " + this.dbResult.rowCount + `\n../downloaded_images/user_${this.dbResult.rows[0].user_id}/${this.dbResult.rows[0].user_id}`);
                return this.dbResult;
            }
        } catch (err) {
            writeLog("\nErro ao procurar imagens de usuário\nErro: " + err);
            return false;
        }
    }

}

module.exports = image;