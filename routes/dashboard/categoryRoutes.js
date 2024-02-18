const router = require('express').Router();   
const categoryController = require('../../controllers/dashboard/categoryController');
const {authMiddlewares} = require('../../middlewares/authMiddlewares');
// const multer = require('multer');
router.post('/category-add',authMiddlewares, categoryController.add_category)
router.get('/category-get',authMiddlewares, categoryController.get_category)




module.exports = router;