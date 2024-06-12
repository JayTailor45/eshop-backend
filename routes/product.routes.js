const express = require('express');
const multer = require('multer');

const productController = require("../controllers/product.controller");

const router = express.Router();

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValidFile = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid Image Type');
        if (isValidFile) {
            uploadError = null;
        }
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
})

const uploadOptions = multer({storage: storage})


router.get('/', productController.getProducts);

router.get('/featured/:count', productController.getFeaturedProducts);

router.post('/', uploadOptions.single('image'), productController.addProduct);

router.delete('/:id', productController.deleteProduct);

router.get('/count', productController.getProductCount);

router.get('/:id', productController.getProduct);

router.put('/:id', uploadOptions.single('image'), productController.updateProduct);

router.put('/gallery-images/:id', uploadOptions.array('images', 8), productController.updateProductGalleryImages);

module.exports = router;