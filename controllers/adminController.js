const Category = require('../models/Category');

module.exports = {
    viewDasboard: (req, res) => {
        res.render('admin/dashboard/viewDashboard.ejs');
    },

    viewCategory: async (req, res) => {
        try {
            const category =  await Category.find();
            // console.log(category);
            res.render('admin/category/viewCategory.ejs', { category });
        } catch(error) {
            res.redirect('/admin/category');
        }
    },

    addCategory: async (req, res) => {
        try {
            const { name } = req.body;
            // console.log(name);
            await Category.create({ name });
            res.redirect('/admin/category');
        } catch(error) { 
            res.redirect('/admin/category');
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findOne({_id: id});
            await category.remove();
            await category.save();
            res.redirect('admin/category');
        } catch {
            res.redirect('/admin/category');
        }
    },

    editCategory: async (req, res) => {
        try {
            const { id, name } = req.body;
            const category = await Category.findOne({ _id: id});
            category.name = name;
            await category.save();
            res.redirect('/admin/category');
        } catch {
            res.redirect('/admin/category');
        }
    },

    viewBank: (req, res) => {
        res.render('admin/bank/viewBank.ejs');
    },

    viewItem: (req, res) => {
        res.render('admin/item/viewItem.ejs');
    },

    viewBooking: (req, res) => {
        res.render('admin/booking/viewBooking.ejs');
    }
};