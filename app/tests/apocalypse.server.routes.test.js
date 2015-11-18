'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Apocalypse = mongoose.model('Apocalypse'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, apocalypse;

/**
 * Apocalypse routes tests
 */
describe('Apocalypse CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Apocalypse
		user.save(function() {
			apocalypse = {
				name: 'Apocalypse Name'
			};

			done();
		});
	});

	it('should be able to save Apocalypse instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Apocalypse
				agent.post('/apocalypses')
					.send(apocalypse)
					.expect(200)
					.end(function(apocalypseSaveErr, apocalypseSaveRes) {
						// Handle Apocalypse save error
						if (apocalypseSaveErr) done(apocalypseSaveErr);

						// Get a list of Apocalypses
						agent.get('/apocalypses')
							.end(function(apocalypsesGetErr, apocalypsesGetRes) {
								// Handle Apocalypse save error
								if (apocalypsesGetErr) done(apocalypsesGetErr);

								// Get Apocalypses list
								var apocalypses = apocalypsesGetRes.body;

								// Set assertions
								(apocalypses[0].user._id).should.equal(userId);
								(apocalypses[0].name).should.match('Apocalypse Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Apocalypse instance if not logged in', function(done) {
		agent.post('/apocalypses')
			.send(apocalypse)
			.expect(401)
			.end(function(apocalypseSaveErr, apocalypseSaveRes) {
				// Call the assertion callback
				done(apocalypseSaveErr);
			});
	});

	it('should not be able to save Apocalypse instance if no name is provided', function(done) {
		// Invalidate name field
		apocalypse.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Apocalypse
				agent.post('/apocalypses')
					.send(apocalypse)
					.expect(400)
					.end(function(apocalypseSaveErr, apocalypseSaveRes) {
						// Set message assertion
						(apocalypseSaveRes.body.message).should.match('Please fill Apocalypse name');
						
						// Handle Apocalypse save error
						done(apocalypseSaveErr);
					});
			});
	});

	it('should be able to update Apocalypse instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Apocalypse
				agent.post('/apocalypses')
					.send(apocalypse)
					.expect(200)
					.end(function(apocalypseSaveErr, apocalypseSaveRes) {
						// Handle Apocalypse save error
						if (apocalypseSaveErr) done(apocalypseSaveErr);

						// Update Apocalypse name
						apocalypse.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Apocalypse
						agent.put('/apocalypses/' + apocalypseSaveRes.body._id)
							.send(apocalypse)
							.expect(200)
							.end(function(apocalypseUpdateErr, apocalypseUpdateRes) {
								// Handle Apocalypse update error
								if (apocalypseUpdateErr) done(apocalypseUpdateErr);

								// Set assertions
								(apocalypseUpdateRes.body._id).should.equal(apocalypseSaveRes.body._id);
								(apocalypseUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Apocalypses if not signed in', function(done) {
		// Create new Apocalypse model instance
		var apocalypseObj = new Apocalypse(apocalypse);

		// Save the Apocalypse
		apocalypseObj.save(function() {
			// Request Apocalypses
			request(app).get('/apocalypses')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Apocalypse if not signed in', function(done) {
		// Create new Apocalypse model instance
		var apocalypseObj = new Apocalypse(apocalypse);

		// Save the Apocalypse
		apocalypseObj.save(function() {
			request(app).get('/apocalypses/' + apocalypseObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', apocalypse.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Apocalypse instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Apocalypse
				agent.post('/apocalypses')
					.send(apocalypse)
					.expect(200)
					.end(function(apocalypseSaveErr, apocalypseSaveRes) {
						// Handle Apocalypse save error
						if (apocalypseSaveErr) done(apocalypseSaveErr);

						// Delete existing Apocalypse
						agent.delete('/apocalypses/' + apocalypseSaveRes.body._id)
							.send(apocalypse)
							.expect(200)
							.end(function(apocalypseDeleteErr, apocalypseDeleteRes) {
								// Handle Apocalypse error error
								if (apocalypseDeleteErr) done(apocalypseDeleteErr);

								// Set assertions
								(apocalypseDeleteRes.body._id).should.equal(apocalypseSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Apocalypse instance if not signed in', function(done) {
		// Set Apocalypse user 
		apocalypse.user = user;

		// Create new Apocalypse model instance
		var apocalypseObj = new Apocalypse(apocalypse);

		// Save the Apocalypse
		apocalypseObj.save(function() {
			// Try deleting Apocalypse
			request(app).delete('/apocalypses/' + apocalypseObj._id)
			.expect(401)
			.end(function(apocalypseDeleteErr, apocalypseDeleteRes) {
				// Set message assertion
				(apocalypseDeleteRes.body.message).should.match('User is not logged in');

				// Handle Apocalypse error error
				done(apocalypseDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Apocalypse.remove().exec();
		done();
	});
});