const express = require('express');
const router = express.Router();

// controllers
const authorController = require('../controllers/authorController');
const bookController = require('../controllers/bookController');
const bookInstanceController = require('../controllers/bookInstanceController');
const genreController = require('../controllers/genreController');

// Author routes
router.get('/author', authorController.list);
router.get('/author/create', authorController.createGet);
router.get('/author/:id', authorController.detail);
router.get('/author/:id/update', authorController.updateGet);
router.get('/author/:id/delete', authorController.deleteGet);

router.post('/author/create', authorController.createPost);
router.post('/author/:id/update', authorController.updatePost);
router.post('/author/:id/delete', authorController.deletePost);

// Book routes
router.get('/', bookController.index);
router.get('/book', bookController.list);
router.get('/book/create', bookController.createGet);
router.get('/book/:id', bookController.detail);
router.get('/book/:id/update', bookController.updateGet);
router.get('/book/:id/delete', bookController.deleteGet);

router.post('/book/create', bookController.createPost);
router.post('/book/:id/update', bookController.updatePost);
router.post('/book/:id/delete', bookController.deletePost);

// BookInstance routes
router.get('/bookInstance', bookInstanceController.list);
router.get('/bookInstance/create', bookInstanceController.createGet);
router.get('/bookInstance/:id', bookInstanceController.detail);
router.get('/bookInstance/:id/update', bookInstanceController.updateGet);
router.get('/bookInstance/:id/delete', bookInstanceController.deleteGet);

router.post('/bookInstance/create', bookInstanceController.createPost);
router.post('/bookInstance/:id/update', bookInstanceController.updatePost);
router.post('/bookInstance/:id/delete', bookInstanceController.deletePost);

// Genre routes
router.get('/genre', genreController.list);
router.get('/genre/create', genreController.createGet);
router.get('/genre/:id', genreController.detail);
router.get('/genre/:id/update', genreController.updateGet);
router.get('/genre/:id/delete', genreController.deleteGet);

router.post('/genre/create', genreController.createPost);
router.post('/genre/:id/update', genreController.updatePost);
router.post('/genre/:id/delete', genreController.deletePost);

module.exports = router;