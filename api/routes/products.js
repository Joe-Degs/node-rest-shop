const router = require('express').Router();
// const router = express.Router();
const multer = require('multer');
const checkAuth = require('../auth/check-auth');
const ProductsController = require('../controllers/product')


const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/');
	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname);
	}
});

function fileType(req, file, cb) {
	file.mimetype.split('/').shift() === 'image' ? cb(null, true) :
		cb(new Error('FILE_TYPE_NOT_SUPPORTED'), false);
}

const upload = multer({
	storage: storage,
	limits: {
		filesSize: 1024 * 1024 * 5
	},
	fileFilter: fileType
});


router.get('/', ProductsController.get_all_products);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.create_new_product);

router.get('/:productID', ProductsController.get_product_with_id);

//takes an array containing an object eg.{propName: '', value: ''}
router.patch('/:productID', checkAuth, ProductsController.update_product);

router.delete('/:productID', checkAuth, ProductsController.delete_product);


module.exports = router;
