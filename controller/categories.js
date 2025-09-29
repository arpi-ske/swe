const Category = require("../models/Category");

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.getAllCategories();
        res.status(200).json({
            success: true,
            data: categories,
    });
    } catch (err) {
        next(err);
    }
};
exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.getCategoryById(req.params.id);
        if (!category) {
            return res.status(400).json({
                success: false,
                error: req.params.id + " id not found",
            });
        }
        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (err) {
        next(err);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const category = await Category.updateCategory(req.params.id, req.body);
        if (!category) {
            return res.status(400).json({
                success: false,
                error: req.params.id + " id not found",
            });
        }
        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (err) {
        next(err);
    }
};

exports.createCategory = async (req, res, next) => {
    try {
        const category = await Category.createCategory(req.body);
        res.status(201).json({
            success: true,
            data: category,
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.deleteCategory(req.params.id);
        if (!category) {
            return res.status(400).json({
                success: false,
                error: req.params.id + " id not found",
            });
        }
        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (err) {
        next(err);
    }
};