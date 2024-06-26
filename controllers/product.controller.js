const mongoose = require('mongoose');

const {Product} = require("../models/product.model");
const {Category} = require("../models/category.model");

exports.getProducts = async (req, res, next) => {
    try {
        let filter = {};
        if (req.query.categories) {
            filter = {category: req.query.categories.split(',')};
        }
        const products =
            await Product
                .find(filter)
                .populate('category');

        if (!products) {
            res.status(500).send('Not Found');
        }
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}

exports.addProduct = async (req, res, next) => {
    try {
        const body = req.body;

        if (!mongoose.isValidObjectId(body.category)) {
            return res.status(404).send('Invalid Category Id');
        }

        if (!req.file) {
            return res.status(400).send('Product image is required');
        }

        const category = await Category.findById(body.category);

        if (!category) {
            return res.status(404).send('Invalid Category');
        }

        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

        let product = new Product({
            name: body.name,
            description: body.description,
            richDescription: body.richDescription,
            image: `${basePath}${fileName}`,
            brand: body.brand,
            price: body.price,
            category: body.category,
            countInStock: body.countInStock,
            rating: body.rating,
            numReviews: body.numReviews,
            isFeatured: body.isFeatured,
        });

        product = await product.save();
        if (!product) {
            res.status(404).send('Failed to add product');
        }
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).send('Invalid Product Id');
        }
        const product = await Product.findByIdAndDelete(req.params.id);
        if (product) {
            return res.status(200).json({
                success: true, message: "The product has been deleted successfully"
            });
        }
        return res.status(404).json({
            success: false, message: "Fail to delete product"
        });
    } catch (error) {
        return res.status(400).json({success: false, error});
    }
}

exports.getProduct = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).send('Invalid Product Id');
        }
        const product = await Product.findById(req.params.id).populate('category');
        if (product) {
            return res.status(200).json(product);
        }
        return res.status(404).json({
            message: "Product not found"
        });
    } catch (error) {
        return res.status(500).json({error});
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const body = req.body;
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).send('Invalid Product Id');
        }
        const category = await Category.findById(body.category);

        if (!category) {
            return res.status(404).send('Invalid Category');
        }

        const existingProduct = await Product.findById(req.params.id);

        if (!existingProduct) {
            return res.status(404).send('Invalid Product');
        }

        const file = req.file;

        let imagePath;

        if (file) {
            const fileName = file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
            imagePath = `${basePath}${fileName}`
        } else {
            imagePath = existingProduct.image;
        }

        const product = await Product.findByIdAndUpdate(req.params.id, {
            name: body.name,
            description: body.description,
            richDescription: body.richDescription,
            image: imagePath,
            brand: body.brand,
            price: body.price,
            category: body.category,
            countInStock: body.countInStock,
            rating: body.rating,
            numReviews: body.numReviews,
            isFeatured: body.isFeatured,
        }, {new: true});
        if (!product) {
            return res.status(500).json({
                message: "Product not found"
            });
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({error});
    }
}

exports.getProductCount = async (req, res) => {
    try {
        const productCount = await Product.countDocuments({}).exec();
        if (!productCount) {
            return res.status(500).json({
                success: false
            });
        }
        return res.status(200).json({productCount,});
    } catch (error) {
        return res.status(500).json({error});
    }
}

exports.getFeaturedProducts = async (req, res, next) => {
    try {
        const limit = req.params.count || 5;
        const products = await Product.find({
            isFeatured: true,
        }).limit(+limit).populate('category');
        if (!products) {
            res.status(500).send('Not Found');
        }
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}

exports.updateProductGalleryImages = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).send('Invalid Product Id');
        }

        const files = req.files;
        let imagePaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if (files) {
            files.forEach(file => {
                imagePaths.push(`${basePath}${file.filename}`);
            });
        }

        const product = await Product.findByIdAndUpdate(req.params.id, {
            images: imagePaths,
        }, {new: true});

        if (!product) {
            return res.status(500).json({
                message: "Product not found"
            });
        }

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({error});
    }
}