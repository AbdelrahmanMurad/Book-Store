const { Router } = require('express');
const { booksController } = require('../controllers')

const router = Router();

router.get('/', booksController.getBooks)

module.exports = router