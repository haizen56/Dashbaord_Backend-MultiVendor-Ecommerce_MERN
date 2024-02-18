const router = require('express').Router();   
const authControllers = require('../controllers/authControllers');
const {authMiddlewares} = require('../middlewares/authMiddlewares');

//  admin routes
router.post('/admin-login/',authControllers.admin_login)
router.get('/get-user',authMiddlewares, authControllers.getUser)

// seller routes

router.post('/seller-register',authControllers.seller_register)
router.post('/seller-login',authControllers.seller_login)



module.exports = router;