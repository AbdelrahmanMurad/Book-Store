const { Router } = require('express');
const { booksController } = require('../controllers')
const { auth } = require('../middlewares')

const router = Router();

router.get('/', auth, booksController.getBooks)//auth => param2 in route: from middleware => so user cant access this page without authorized token

module.exports = router