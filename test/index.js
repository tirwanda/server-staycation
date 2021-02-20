const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');

chai.use(chaiHttp);

describe('API ENDPOINT TESTING', () => {
	it('GET Landing Page', () => {
		chai.request(app)
			.get('/api/v1/member/landingPage')
			.then((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res.body).to.be.an('Object');
				expect(res.body).to.have.property('hero');
				expect(res.body.hero).to.have.all.keys(
					'travelers',
					'treasures',
					'city'
				);
				expect(res.body).to.have.property('mostPicked');
				expect(res.body.mostPicked).to.have.an('array');
				expect(res.body).to.have.property('category');
				expect(res.body.category).to.have.an('array');
				expect(res.body).to.have.property('testimonial');
				expect(res.body.testimonial).to.have.an('Object');
			})
			.catch(function (err) {
				throw err;
			});
	});

	it('GET Detail Page', () => {
		chai.request(app)
			.get('/api/v1/member/itemDetail/5e96cbe292b97300fc902230')
			.then((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				expect(res.body).to.be.an('Object');
				expect(res.body).to.have.property('country');
				expect(res.body).to.have.property('isPopular');
				expect(res.body).to.have.property('unit');
				expect(res.body).to.have.property('sumBooking');
				expect(res.body).to.have.property('imageId');
				expect(res.body.imageId).to.have.an('array');
				expect(res.body).to.have.property('featuredId');
				expect(res.body.featuredId).to.have.an('array');
				expect(res.body).to.have.property('activityId');
				expect(res.body.activityId).to.have.an('array');
				expect(res.body).to.have.property('_id');
				expect(res.body).to.have.property('title');
				expect(res.body).to.have.property('price');
				expect(res.body).to.have.property('city');
				expect(res.body).to.have.property('description');
				expect(res.body).to.have.property('categoryId');
				expect(res.body).to.have.property('testimonial');
				expect(res.body.testimonial).to.have.an('Object');
			})
			.catch(function (err) {
				throw err;
			});
	});
});
