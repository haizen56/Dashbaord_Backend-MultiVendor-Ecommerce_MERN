const router = require('express').Router();   
const productController = require('../../controllers/dashboard/productController');
const {authMiddlewares} = require('../../middlewares/authMiddlewares');

router.post('/product-add',authMiddlewares, productController.add_product)
router.get('/products-get', authMiddlewares, productController.products_get)




module.exports = router;