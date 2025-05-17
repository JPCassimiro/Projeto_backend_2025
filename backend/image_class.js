const pool = require('./db');
const writeLog = require('../logs/log_handler');
const fs = require('fs');

class image{
    constructor(name=null, id=null, file=null, dbResult=null){
        this.name = name;
        this.id = id;
        this.file = file;
        this.dbResult = dbResult;
    }

    set setImageName(name){
        this.name = name;
    }

    set setImageID(id){
        this.id = id;
    }

    set setImageFile(file){
        this.file = file;
    }

    set setDbResult(dbResult){
        this.dbResult=dbResult
    }

    get getDbResult(){
        return this.dbResult;
    }

    async insertImage(){
        try{
            if(this.name === null || this.name === undefined || typeof(this.name)!="string" || this.name === ""){
                throw `Formatação de entrada incorreta\nName: ${this.name} Type: ${typeof(this.name)}\n`;
            }else{
                const fileBuffer = Buffer.isBuffer(this.file) ? this.file : fs.readFileSync(this.file);
                const query = `INSERT INTO image (image_name, image_file) VALUES($1, $2) RETURNING image_id`;
                const values = [this.name, fileBuffer];
                this.setDbResult = await pool.query(query, values);
                writeLog("\nImagem salva com sucesso!\nImage ID:"+this.dbResult.rows[0].image_id);
            }
        }catch(err){
            writeLog("\nErro ao salvar imagem!\n"+err);
        }
    }

    async searchImage(){
        try {
            if(this.id === null || this.id === undefined || typeof(this.id)!="number"){
                throw `Formatação da entrada incorreta\nID: ${this.id} typeOf: ${typeof(this.id)}`;
            }else{
                const query = `SELECT * from image where image_id = '${this.id}'`;
                this.setDbResult = await pool.query(query);
                fs.writeFileSync(`../downloaded_images/${this.dbResult.rows[0].image_name}`,this.dbResult.rows[0].image_file);
                writeLog("\nImagem encontrada com sucesso!\n"+this.dbResult.rows[0].image_name);
            }
        } catch (err) {
            writeLog("\nImagem não encontrada!\n"+err);
        }
    }

    async deleteImage(){
        try {
            if (this.id === null || this.id === undefined || typeof(this.id)!="number") {
                throw `Formatação da entrada incorreta\nID: ${this.id} typeOf: ${typeof(this.id)}`;
            }else{
                const query = `DELETE from image where image_id = '${this.id}' RETURNING *`;
                this.setDbResult = await pool.query(query);
                writeLog("\nImagem apagada com sucesso!\nID: "+this.dbResult.rows[0].image_id);
            }
        } catch (err) {
            writeLog(`\nA imagem ${this.id} não pôde ser apagada!\n` + err);
        }
    }

}
const path = ""//path da imagem a ser salva
const fileName = path.split("/");
const imageObj = new image(fileName[fileName.length-1],55,path);
