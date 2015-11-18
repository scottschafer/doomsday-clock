'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var apocalypses = require('../../app/controllers/apocalypses.server.controller');

	// Apocalypses Routes
	app.route('/apocalypses')
		.get(apocalypses.list)
		.post(users.requiresLogin, apocalypses.create);

	app.route('/apocalypses/:apocalypseId')
		.get(apocalypses.read)
		.put(users.requiresLogin, apocalypses.hasAuthorization, apocalypses.update)
		.delete(users.requiresLogin, apocalypses.hasAuthorization, apocalypses.delete);

	// Finish by binding the Apocalypse middleware
	app.param('apocalypseId', apocalypses.apocalypseByID);
};
