const Item = require('../models/Item');
const Treasure = require('../models/Activity');
const Traveler = require('../models/Booking');
const Category = require('../models/Category');
const Bank = require('../models/Bank');

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
					option: { sort: { sumBooking: -1 } }, //Sortir dari yang terbesar
					populate: {
						path: 'imageId',
						select: '_id imageUrl',
						perDocumentLimit: 1,
					},
				});

			for (let i = 0; i < category.length; i++) {
				for (let x = 0; x < category[i].itemId.length; x++) {
					const item = await Item.findOne({
						_id: category[i].itemId[x]._id,
					});
					item.isPopular = false;
					await item.save();
					if (category[i].itemId[0] === category[i].itemId[x]) {
						item.isPopular = true;
						await item.save();
					}
				}
			}

			const testimonial = {
				_id: 'asd1293uasdads1',
				imageUrl: 'images/testimonial2.jpg',
				name: 'Happy Family',
				rate: 4.55,
				content:
					'What a great trip with my family and I should try again next time soon ...',
				familyName: 'Angga',
				familyOccupation: 'Product Designer',
			};

			res.status(200).json({
				hero: {
					travelers: travelers.length,
					treasures: treasures.length,
					city: city.length,
				},
				mostPicked,
				category,
				testimonial,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	},

	itemDetail: async (req, res) => {
		try {
			const { id } = req.params;
			const item = await Item.findOne({ _id: id })
				.populate({ path: 'imageId', select: '_id imageUrl' })
				.populate({
					path: 'featuredId',
					select: '_id name qty imageUrl',
				})
				.populate({
					path: 'activityId',
					select: '_id name type imageUrl',
				});

			const bank = await Bank.find();

			const testimonial = {
				_id: 'asd1293uasdads1',
				imageUrl: 'images/testimonial1.jpg',
				name: 'Happy Family',
				rate: 4.25,
				content:
					'What a great trip with my family and I should try again and again next time soon...',
				familyName: 'Angga',
				familyOccupation: 'UI Designer',
			};

			res.status(200).json({
				...item._doc,
				bank,
				testimonial,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	},
};
