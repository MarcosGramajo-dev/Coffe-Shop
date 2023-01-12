const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload')

const {
  getArticle, createtArticle, deleteArticle, editArticle } = require('../Controllers/articles.controllers')

/* GET home page. */
router.get('/', getArticle);
router.post('/', upload.single('foto') , createtArticle);
router.delete('/:id', deleteArticle);
router.put('/:id', editArticle);

module.exports = router;
