const pool = require('./db');

//!!TODO
/*
    INSERÇÃO 
        IMAGENS
        ALBUM
        JUNCTION
    DELEÇÃO
        IMAGENS
        ALBUM
    REMOÇÃO
        JUNCTION
    UPDATE
        IMAGE NAME
        ALBUM NAME
    SELECT
        IMAGE NAME
        ALBUM NAME
 */

const connectionTest = async ()=>{
    try{
        const result = await pool.query('SELECT * FROM public.image');
        console.log(result.rows);
    }catch (err){
        console.log(err);
    }
}

const shutdown = async ()=>{
    try{
        await pool.end();
    }catch(err){
        console.log(err);
    }
}

/*const searchImage = async (imageName) =>{
    const query = `SELECT * from image where image_name = '${imageName}'`;
    try {
        const res = await pool.query(query);
        console.log("Dados da imagem:\n"+ JSON.stringify(res.rows));         
    } catch(err){
        console.log(err);
    }
}*/

/*const deleteImage = async (imageID) =>{
    const query = `DELETE from image where image_id = '${imageID}'`;
    try{
        const res = await pool.query(query);
        console.log("Imagem deletada")
    }catch(err){
        console.log(err);
    }
}*/
