const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
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
			res.redirect('/admin/bank');
		}
	},

	viewItem: async (req, res) => {
		try {
			const category = await Category.find();
			const item = await Item.find()
				.populate({ path: 'imageId', select: 'id imageUrl' })
				.populate({ path: 'categoryId', select: 'id name' });
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = { message: alertMessage, status: alertStatus };
			res.render('admin/item/viewItem.ejs', {
				item,
				category,
				alert,
				title: 'Staycation | Item',
				action: 'view',
			});
		} catch (error) {
			res.redirect('/admin/item');
		}
	},

	showImageItem: async (req, res) => {
		try {
			const { id } = req.params;
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = { message: alertMessage, status: alertStatus };
			const item = await Item.findOne({ _id: id }).populate({
				path: 'imageId',
				select: 'id imageUrl',
			});
			res.render('admin/item/viewItem.ejs', {
				item,
				alert,
				title: 'Staycation | Show Image Item',
				action: 'show image',
			});
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/item');
		}
	},

	showEditItem: async (req, res) => {
		try {
			const { id } = req.params;
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = { message: alertMessage, status: alertStatus };
			const item = await Item.findOne({ _id: id })
				.populate({ path: 'imageId', select: 'id imageUrl' })
				.populate({ path: 'categoryId', select: 'id name' });
			const category = await Category.find();
			res.render('admin/item/viewItem.ejs', {
				item,
				category,
				alert,
				title: 'Staycation | Edit Item',
				action: 'edit',
			});
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/item');
		}
	},

	addItem: async (req, res) => {
		try {
			const { title, price, city, categoryId, about } = req.body;
			if (req.files.length > 0) {
				const category = await Category.findOne({ _id: categoryId });
				const newItem = {
					categoryId: category._id,
					title,
					price,
					city,
					description: about,
				};

				const item = await Item.create(newItem);
				category.itemId.push({ _id: item._id });
				await category.save();

				for (let i = 0; i < req.files.length; i++) {
					const imageSave = await Image.create({
						imageUrl: `images/${req.files[i].filename}`,
					});
					item.imageId.push({ _id: imageSave._id });
					await item.save();
				}
				req.flash('alertMessage', 'Success Add Item');
				req.flash('alertStatus', 'success');
				res.redirect('/admin/item');
			}
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/item');
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

	editItem: async (req, res) => {
		try {
			const { id } = req.params;
			const { title, price, city, categoryId, about } = req.body;
			const item = await Item.findOne({ _id: id })
				.populate({ path: 'imageId', select: 'id imageUrl' })
				.populate({ path: 'categoryId', select: 'id name' });

			if (req.files.length > 0) {
				for (let i = 0; i < item.imageId.length; i++) {
					const updateImage = await Image.findOne({
						_id: item.imageId[i]._id,
					});
					await fs.unlink(
						path.join(`public/${updateImage.imageUrl}`)
					);
					updateImage.imageUrl = `images/${req.files[i].filename}`;
					await updateImage.save();
				}
				item.title = title;
				item.price = price;
				item.city = city;
				item.description = about;
				item.categoryId = categoryId;
				await item.save();
				req.flash('alertMessage', 'Success Edit Item');
				req.flash('alertStatus', 'success');
				res.redirect('/admin/item');
			} else {
				item.title = title;
				item.price = price;
				item.city = city;
				item.description = about;
				item.categoryId = categoryId;
				await item.save();
				req.flash('alertMessage', 'Success Edit Item');
				req.flash('alertStatus', 'success');
				res.redirect('/admin/item');
			}
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/item');
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

	viewBooking: (req, res) => {
		res.render('admin/booking/viewBooking.ejs', {
			title: 'Staycation | Booking',
		});
	},
};
