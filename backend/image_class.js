const pool = require('./db');
const writeLog = require('../logs/log_handler');

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
                const query = `INSERT INTO image (image_name, image_file) VALUES('${this.name}','${this.file}') RETURNING image_id`;
                this.setDbResult = await pool.query(query);
                writeLog("\nImagem salva com sucesso!\nImage ID:"+this.dbResult);
            }
        }catch(err){
            writeLog("\nErro ao salvar imagem!\n"+err);
        }
    }

    async searchImage(){
        try {
            if(this.id === null || this.id === undefined || typeof(this.id)!="Number"){
                throw `Formatação da entrada incorreta\nID: ${this.id} typeOf: ${typeof(this.id)}`;
            }else{
                const query = `SELECT * from image where image_id = '${this.id}' RETURNING image_file`;
                this.setDbResult = await pool.query(query);
                writeLog("\nImagem encontrada com sucesso!\n"+this.dbResult);
            }
        } catch (err) {
            writeLog("\nImagem não encontrada!\n"+err);
        }
    }

    async deleteImage(){
        try {
            if (this.id === null || this.id === undefined || typeof(this.id)!="Number") {
                throw `Formatação da entrada incorreta\nID: ${this.id} typeOf: ${typeof(this.id)}`;
            }else{
                const query = `DELETE from image where image_id = '${this.id}' RETURNING *`;
                this.setDbResult = await pool.query(query);
                writeLog("\nImagem apagada com sucesso!\n"+this.dbResult);
            }
        } catch (err) {
            writeLog(`\nA imagem ${this.id} não pôde ser apagada!\n` + err);
        }
    }

    //N sei se vai precisar desse cara
    //async updateImage(){}

}

const imageObj = new image();

imageObj.insertImage();
imageObj.searchImage();
imageObj.deleteImage();
