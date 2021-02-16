const Item = require('../models/Item');
const Treasure = require('../models/Activity');
const Traveler = require('../models/Booking');

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

			res.status(200).json({
				hero: {
					travelers: travelers.length,
					treasures: treasures.length,
					city: city.length,
				},
				mostPicked,
			});
		} catch (error) {}
	},
};
