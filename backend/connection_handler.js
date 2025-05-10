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

const insertImage = async (imageData)=>{
    const query = `INSERT INTO image (image_name, image_file) VALUES('${imageData.name}','${imageData.file}') RETURNING image_id`;
    try{
        const res = await pool.query(query)
        console.log("Sucesso:" + res);
    } catch(err){
        console.log(query);
        console.log(err);
    }
}

const searchImage = async (imageName) =>{
    const query = `SELECT * from image where image_name = '${imageName}'`;
    try {
        const res = await pool.query(query);
        console.log("Dados da imagem:\n"+ JSON.stringify(res.rows));         
    } catch(err){
        console.log(err);
    }
}

const deleteImage = async (imageID) =>{
    const query = `DELETE from image where image_id = '${imageID}'`;
    try{
        const res = await pool.query(query);
        console.log("Imagem deletada")
    }catch(err){
        console.log(err);
    }
}

const createAlbum = async (albumData) =>{
    try{
        const query = `INSERT INTO album (album_name) VALUES('${albumData.name}')`;
        const res = await pool.query(query);
        console.log("Sucesso na inseção em album: " + res);
    } catch(err){
        console.log(err);
    }
}

const insertImageIntoAlbum = async (connectionData) =>{
    try{
        const query = `INSERT INTO album_image_junction (image_id, album_id) VALUES('${connectionData.image}',${connectionData.album}) RETURNING image_id`;
        const res = await pool.query(query);
    } catch(err){
        console.log(err);
    }
}

const deleteAlbum = async (albumData) =>{
    try{
        const query = `DELETE FROM album WHERE album_id = '${albumData.id}'`;
        await pool.query(query)
    } catch(err){
        console.log(err);
    }
}

const removeImageFromAlbum = async (imageData, albumData) =>{
    try{
        const query = `DELETE FROM album_image_junction WHERE album_id = '${albumData.id}' and image_id = '${imageData.id}'`
    } catch(err){
        console.log(err);
    }
}

const updateAlbumName = async (albumData) =>{
    try{
        const query = `UPDATE FROM album SET album_name = '${albumData.name}' WHERE album_id = '${albumData.id}' RETURNING album_id`;
        const res = pool.query(query);
        console.log("Sucesso na alteração de nome do album: " + res);
    }catch(err){
        console.log(err);
    }
}

const returnImagesInAlbum = async (albumData) =>{
    try{
        const query = `SELECT * FROM album_image_junction where album_id = '${albumData.id}'`;
        const res = await pool.query(query);
        console.log("Imagens no album: " + JSON.stringify(res.rows));
    }catch(err){
        console.log(err);
    }
}

// insertImage({name:"name2",file:"file2"});
// insertImageIntoAlbum({image:3,album:1});
returnImagesInAlbum({id:1});