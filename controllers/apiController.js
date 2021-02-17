const Item = require('../models/Item');
const Treasure = require('../models/Activity');
const Traveler = require('../models/Booking');
const Category = require('../models/Category');

module.exports = {
	landingPage: async (req, res) => {
		try {
			const mostPicked = await Item.find()
				.select('_id title country city price unit imageId')
				.limit(5)
				.populate({ path: 'imageId', select: '_id imageUrl' });

			const treasures = await Treasure.find();
			const travelers = await Traveler.find();
			const city = await Item.find();
			const category = await Category.find()
				.select('_id name')
				.limit(3)
				.populate({
					path: 'itemId',
					select: '_id title isPopular country city imageId',
					perDocumentLimit: 4,
					populate: {
						path: 'imageId',
						select: '_id imageUrl',
						perDocumentLimit: 1,
					},
				});

			res.status(200).json({
				hero: {
					travelers: travelers.length,
					treasures: treasures.length,
					city: city.length,
				},
				mostPicked,
				category,
			});
		} catch (error) {}
	},
};
