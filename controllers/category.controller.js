const {Category} = require("../models/category.model");

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        if (!categories) {
            res.status(500).send('Not Found');
        }
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
}

exports.addCategory = async (req, res, next) => {
    try {
        const body = req.body;
        let category = new Category({
            name: body.name,
            icon: body.icon,
            color: body.color,
        });

        category = await category.save();
        if (!category) {
            res.status(404).send('Failed to add category');
        }
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (category) {
            return res.status(200).json({
                success: true,
                message: "The category has been deleted successfully"
            });
        }
        return res.status(404).json({
            success: false,
            message: "Fail to delete category"
        });
    } catch (error) {
        return res.status(400).json({success: false, error});
    }
}

exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            _id: req.params.id
        });
        if (category) {
            return res.status(200).json(category);
        }
        return res.status(404).json({
            message: "Category not found"
        });
    } catch (error) {
        return res.status(500).json({error});
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const body = req.body;
        const category = await Category.findByIdAndUpdate(req.params.id, {
            name: body.name,
            icon: body.icon,
            color: body.color,
        }, {new: true});
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }
        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({error});
    }
}