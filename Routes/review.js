const { Router } = require('express')
const { reviewController } = require('../controllers')
const { auth } = require('../middlewares')

const router = Router()

// add review => post
router.post('/add', auth, reviewController.add)//auth => param2 in route: from middleware => so user cant access this page without authorized token
    .delete('/delete/:id', auth, reviewController.remove)//auth => param2 in route: from middleware => so user cant access this page without authorized token
//:id => path parameter
module.exports = router;
