const Category = require('../models/Category');

module.exports = {
    viewDasboard: (req, res) => {
        res.render('admin/dashboard/viewDashboard.ejs');
    },

    viewCategory: (req, res) => {
        res.render('admin/category/viewCategory.ejs');
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