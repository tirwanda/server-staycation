const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const Feature = require('../models/Feature');
const Activity = require('../models/Activity');
const Booking = require('../models/Booking');
const Member = require('../models/Member');
const Users = require('../models/Users');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');

module.exports = {
	viewSignin: async (req, res) => {
		try {
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = { message: alertMessage, status: alertStatus };

			if (req.session.user == null || req.session.user == undefined) {
				res.render('index.ejs', {
					alert,
					title: 'Staycation | Signin',
				});
			} else {
				res.redirect('/admin/dashboard');
			}
		} catch (error) {
			res.redirect('/admin/signin');
		}
	},

	actionSignin: async (req, res) => {
		try {
			const { username, password } = req.body;
			const user = await Users.findOne({ username: username });

			if (!user) {
				req.flash('alertMessage', 'User or Password Not Found');
				req.flash('alertStatus', 'danger');
				res.redirect('/admin/signin');
			}

			const isPasswordMatch = await bcrypt.compare(
				password,
				user.password
			);

			if (!isPasswordMatch) {
				req.flash('alertMessage', 'User or Password Not Found');
				req.flash('alertStatus', 'danger');
				res.redirect('/admin/signin');
			}

			req.session.user = {
				id: user.id,
				username: user.username,
			};

			res.redirect('/admin/dashboard');
		} catch (error) {
			res.redirect('/admin/signin');
		}
	},

	actionLogout: (req, res) => {
		req.session.destroy();
		res.redirect('/admin/signin');
	},

	actionConfirmation: async (req, res) => {
		const { bookingId } = req.params;
		try {
			const booking = await Booking.findOne({ _id: bookingId });
			booking.payments.status = 'Accept';
			req.flash('alertMessage', 'Success Confirm Booking');
			req.flash('alertStatus', 'success');
			await booking.save();
			res.redirect(`/admin/booking/${bookingId}`);
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/booking/${bookingId}`);
		}
	},

	actionReject: async (req, res) => {
		const { bookingId } = req.params;
		try {
			const booking = await Booking.findOne({
				_id: bookingId,
			});
			booking.payments.status = 'Rejected';
			req.flash('alertMessage', 'Success Rejected Booking');
			req.flash('alertStatus', 'success');
			await booking.save();
			res.redirect(`/admin/booking/${bookingId}`);
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/booking/${bookingId}`);
		}
	},

	viewDasboard: async (req, res) => {
		try {
			const member = await Member.find();
			const booking = await Booking.find();
			const item = await Item.find();
			res.render('admin/dashboard/viewDashboard.ejs', {
				title: 'Staycation | Dashboard',
				user: req.session.user,
				member,
				booking,
				item,
			});
		} catch (error) {
			res.redirect('/admin/dashboard');
		}
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
				user: req.session.user,
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
				user: req.session.user,
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
				user: req.session.user,
			});
		} catch (error) {
			res.redirect('/admin/item');
		}
	},

	showDetailItem: async (req, res) => {
		const { itemId } = req.params;
		try {
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = { message: alertMessage, status: alertStatus };
			const feature = await Feature.find({ itemId: itemId });
			const activity = await Activity.find({ itemId: itemId });

			res.render('admin/item/detail-item/showDetailItem.ejs', {
				title: 'Staycation | Detail Item',
				alert,
				itemId,
				activity,
				feature,
				user: req.session.user,
			});
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/showDetailItem/${itemId}`);
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
				user: req.session.user,
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

	showDetailBooking: async (req, res) => {
		const { bookingId } = req.params;
		try {
			const booking = await Booking.findOne({ _id: bookingId })
				.populate('memberId')
				.populate('bankId');
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message: alertMessage,
				status: alertStatus,
			};
			res.render('admin/booking/showDetailBooking.ejs', {
				alert,
				booking,
				title: 'Staycation | Detail Booking',
				user: req.session.user,
			});
		} catch (error) {
			res.redirect('/admin/booking');
		}
	},

	viewBooking: async (req, res) => {
		try {
			const booking = await Booking.find()
				.populate('memberId')
				.populate('bankId');
			res.render('admin/booking/viewBooking.ejs', {
				booking,
				title: 'Staycation | Booking',
				user: req.session.user,
			});
		} catch (error) {
			res.redirect('/admin/booking');
		}
	},

	addActivity: async (req, res) => {
		const { activityName, activityType, itemId } = req.body;
		try {
			if (!req.file) {
				req.flash('alertMessage', 'Image Not Found');
				req.flash('alertStatus', 'danger');
				req.redirect(`/admin/item/showDetailItem/${itemId}`);
			}

			const activity = await Activity.create({
				name: activityName,
				type: activityType,
				itemId,
				imageUrl: `images/${req.file.filename}`,
			});

			const item = await Item.findOne({ _id: itemId });
			item.activityId.push({ _id: activity._id });
			item.save();
			req.flash('alertMessage', 'Success Add Activity');
			req.flash('alertStatus', 'success');
			res.redirect(`/admin/item/showDetailItem/${itemId}`);
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/showDetailItem/${itemId}`);
		}
	},

	addFeature: async (req, res) => {
		const { featureName, quantity, itemId } = req.body;
		try {
			if (!req.file) {
				req.flash('alertMessage', 'Image Not Found');
				req.flash('alertStatus', 'danger');
				req.redirect(`/admin/item/showDetailItem/${itemId}`);
			}

			const feature = await Feature.create({
				name: featureName,
				qty: quantity,
				itemId,
				imageUrl: `images/${req.file.filename}`,
			});

			const item = await Item.findOne({ _id: itemId });
			item.featuredId.push({ _id: feature._id });
			item.save();
			req.flash('alertMessage', 'Success Add Feature');
			req.flash('alertStatus', 'success');
			res.redirect(`/admin/item/showDetailItem/${itemId}`);
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/showDetailItem/${itemId}`);
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

	editActivity: async (req, res) => {
		const { id, name, type, itemId } = req.body;
		try {
			const activity = await Activity.findOne({ _id: id });
			if (req.file == undefined) {
				activity.name = name;
				activity.type = type;
				await activity.save();
				req.flash('alertMessage', 'Success Update Activity');
				req.flash('alertStatus', 'success');
				res.redirect(`/admin/item/showDetailItem/${itemId}`);
			} else {
				await fs.unlink(path.join(`public/${activity.imageUrl}`));
				activity.name = name;
				activity.type = type;
				activity.imageUrl = `images/${req.file.filename}`;
				await activity.save();
				req.flash('alertMessage', 'Success Update Activity');
				req.flash('alertStatus', 'success');
				res.redirect(`/admin/item/showDetailItem/${itemId}`);
			}
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/showDetailItem/${itemId}`);
		}
	},

	editFeature: async (req, res) => {
		const { id, name, qty, itemId } = req.body;
		try {
			const feature = await Feature.findOne({ _id: id });
			if (req.file == undefined) {
				feature.name = name;
				feature.qty = qty;
				await feature.save();
				req.flash('alertMessage', 'Success Update Feature');
				req.flash('alertStatus', 'success');
				res.redirect(`/admin/item/showDetailItem/${itemId}`);
			} else {
				await fs.unlink(path.join(`public/${feature.imageUrl}`));
				feature.name = name;
				feature.qty = qty;
				feature.imageUrl = `images/${req.file.filename}`;
				await feature.save();
				req.flash('alertMessage', 'Success Update Feature');
				req.flash('alertStatus', 'success');
				res.redirect(`/admin/item/showDetailItem/${itemId}`);
			}
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/showDetailItem/${itemId}`);
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

	deleteActivity: async (req, res) => {
		const { id, itemId } = req.params;
		try {
			const activity = await Activity.findOne({ _id: id });
			const item = await Item.findOne({ _id: itemId }).populate(
				'activityId'
			);
			for (let i = 0; i < item.activityId.length; i++) {
				if (
					item.activityId[i]._id.toString() ===
					activity._id.toString()
				) {
					item.activityId.pull({ _id: activity._id });
					await item.save();
				}
			}
			await fs.unlink(path.join(`public/${activity.imageUrl}`));
			await activity.remove();
			req.flash('alertMessage', 'Success Delete Activity');
			req.flash('alertStatus', 'success');
			res.redirect(`/admin/item/showDetailItem/${itemId}`);
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/showDetailItem/${itemId}`);
		}
	},

	deleteFeature: async (req, res) => {
		const { id, itemId } = req.params;
		try {
			const feature = await Feature.findOne({ _id: id });

			const item = await Item.findOne({ _id: itemId }).populate(
				'featuredId'
			);
			for (let i = 0; i < item.featuredId.length; i++) {
				if (
					item.featuredId[i]._id.toString() === feature._id.toString()
				) {
					item.featuredId.pull({ _id: feature._id });
					await item.save();
				}
			}
			await fs.unlink(path.join(`public/${feature.imageUrl}`));
			await feature.remove();
			req.flash('alertMessage', 'Success Delete Feature');
			req.flash('alertStatus', 'success');
			res.redirect(`/admin/item/showDetailItem/${itemId}`);
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/showDetailItem/${itemId}`);
		}
	},

	deleteItem: async (req, res) => {
		try {
			const { id } = req.params;
			const item = await Item.findOne({ _id: id }).populate('imageId');
			for (let i = 0; i < item.imageId.length; i++) {
				Image.findOne({ _id: item.imageId[i]._id })
					.then(async (image) => {
						await fs.unlink(path.join(`public/${image.imageUrl}`));
						image.remove();
					})
					.catch((error) => {
						req.flash('alertMessage', `${error.message}`);
						req.flash('alertStatus', 'danger');
						res.redirect('/admin/item');
					});
			}
			await item.remove();
			req.flash('alertMessage', 'Success Delete Item');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/bank');
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
};
