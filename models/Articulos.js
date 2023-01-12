
const {Schema, model} = require('mongoose');

const articulo = new Schema({
    titulo: {type: String, required: true},
    descripcion: {type: String, required: false},
    cantStock: {type: Number, required: true},
    tipoDescuento: {type: String, required: true},
    precioUnitario: {type: Number, required: true},
    foto: {type: String, required: true}
  });
module.exports = model('Articulo', articulo);