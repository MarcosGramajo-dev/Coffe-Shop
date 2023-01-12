
const Articulo = require('../models/Articulos');

const articleCtrl = {};

articleCtrl.getArticle = async (req, res) => {
    const { id } = req.params;

 try {
    let articulos; 
    if(id){
        articulos = await Articulo.findById(id);
    }
    else{
        articulos = await Articulo.find();
    }

    res.status(200).json(articulos);
    
 } catch (error) {
    console.log(error)
 }
}


articleCtrl.createtArticle = async (req, res) =>{
    const {titulo, descripcion, cantStock, tipoDescuento, precioUnitario} = req.body;
    
    try {
    const urlFoto = `${process.env.URL}/uploads/${req.file.filename}`
    const newArticulo = new Articulo ({
        titulo, 
        descripcion, 
        cantStock, 
        tipoDescuento, 
        precioUnitario, 
        foto: urlFoto
    })

    const savedArticulos = await newArticulo.save();

    res.status(201).json(savedArticulos)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "error",
            error,
        })
    }
}

articleCtrl.deleteArticle = async (req, res) =>{
    const { id } = req.params;

    try {
        const article = await Articulo.findById( id )
        if(!article){
            return res.status(500).json({
                status: "error",
                error,
            })
        }

        await article.remove()

        res.status(200).json({
            article
        })


    } catch (error) {
        res.status(500).json({
            status: "error",
            messege: "No se pudo borrar",
            error,
        })
    }
}

articleCtrl.editArticle = async (req, res) => {
    const { id } = req.params;

    try {
        const article = await Articulo.findByIdAndUpdate( id, req.body );
        if(!article){
            return res.status(500).json({
                status: "error",
                error,
            })
        }

        res.status(200).json({
            status: "SUCCES",
            messege: "Se edito correctaente"
        })
        
    } catch (error) {
        res.status(500).json({
            status: "error",
            messege: "No se pudo borrar",
            error,
        })
    }

}


module.exports = articleCtrl;