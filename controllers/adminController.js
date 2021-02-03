const Category = require('../models/Category');

module.exports = {
	viewDasboard: (req, res) => {
		res.render('admin/dashboard/viewDashboard.ejs', {
			title: 'Staycation | Dashboard',
		});
	},

	viewCategory: async (req, res) => {
		try {
			const category = await Category.find();
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = { message: alertMessage, status: alertStatus };
			res.render('admin/category/viewCategory.ejs', {
				category,
				alert,
				title: 'Staycation | Category',
			});
		} catch (error) {
			res.redirect('/admin/category');
		}
	},

	addCategory: async (req, res) => {
		try {
			const { name } = req.body;
			req.flash('alertMessage', 'Success Add Category');
			req.flash('alertStatus', 'success');
			await Category.create({ name });
			res.redirect('/admin/category');
		} catch (error) {
			res.redirect('/admin/category');
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
		}
	},

	deleteCategory: async (req, res) => {
		try {
			const { id } = req.params;
			const category = await Category.findOne({ _id: id });
			await category.remove();
			req.flash('alertMessage', 'Success Delete Category');
			req.flash('alertStatus', 'success');
			await category.save();
			res.redirect('admin/category');
		} catch {
			res.redirect('/admin/category');
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
		}
	},

	editCategory: async (req, res) => {
		try {
			const { id, name } = req.body;
			const category = await Category.findOne({ _id: id });
			category.name = name;
			await category.save();
			req.flash('alertMessage', 'Success Edit Category');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/category');
		} catch {
			res.redirect('/admin/category');
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
		}
	},

	viewBank: (req, res) => {
		res.render('admin/bank/viewBank.ejs', {
			title: 'Staycation | Bank',
		});
	},

	viewItem: (req, res) => {
		res.render('admin/item/viewItem.ejs', {
			title: 'Staycation | Item',
		});
	},

	viewBooking: (req, res) => {
		res.render('admin/booking/viewBooking.ejs', {
			title: 'Staycation | Booking',
		});
	},
};
