const Category = require('../models/Category');
const Bank = require('../models/Bank');
const fs = require('fs-extra');
const path = require('path');

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

	viewBank: async (req, res) => {
		try {
			const bank = await Bank.find();
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = { message: alertMessage, status: alertStatus };
			res.render('admin/bank/viewBank.ejs', {
				title: 'Staycation | Bank',
				bank,
				alert,
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
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/category');
		}
	},

	addBank: async (req, res) => {
		try {
			const { bankName, accountNumber, name } = req.body;
			req.flash('alertMessage', 'Success Add Bank');
			req.flash('alertStatus', 'success');
			await Bank.create({
				bankName,
				accountNumber,
				name,
				imageUrl: `images/${req.file.filename}`,
			});
			res.redirect('/admin/bank');
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/bank');
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
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/category');
		}
	},

	editBank: async (req, res) => {
		try {
			const { id, bankName, accountNumber, name } = req.body;
			const bank = await Bank.findOne({ _id: id });
			if (req.file == undefined) {
				bank.bankName = bankName;
				bank.accountNumber = accountNumber;
				bank.name = name;
				await bank.save();
				req.flash('alertMessage', 'Success Edit Bank');
				req.flash('alertStatus', 'success');
				res.redirect('/admin/bank');
			} else {
				await fs.unlink(path.join(`public/${bank.imageUrl}`));
				bank.bankName = bankName;
				bank.accountNumber = accountNumber;
				bank.name = name;
				bank.imageUrl = `images/${req.file.filename}`;
				await bank.save();
				req.flash('alertMessage', 'Success Edit Bank');
				req.flash('alertStatus', 'success');
				res.redirect('/admin/bank');
			}
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/bank');
		}
	},

	deleteCategory: async (req, res) => {
		try {
			const { id } = req.params;
			const category = await Category.findOne({ _id: id });
			await category.remove();
			req.flash('alertMessage', 'Success Delete Category');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/category');
		} catch {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/category');
		}
	},

	deleteBank: async (req, res) => {
		try {
			const { id } = req.params;
			// console.log(req);
			const bank = await Bank.findOne({ _id: id });
			await fs.unlink(path.join(`public/${bank.imageUrl}`));
			await bank.remove();
			req.flash('alertMessage', 'Success Delete Bank');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/bank');
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/bank');
		}
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
