'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Apocalypse = mongoose.model('Apocalypse'),
	_ = require('lodash');

/**
 * Create a Apocalypse
 */
exports.create = function(req, res) {
	var apocalypse = new Apocalypse(req.body);
	apocalypse.user = req.user;

	apocalypse.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(apocalypse);
		}
	});
};

/**
 * Show the current Apocalypse
 */
exports.read = function(req, res) {
	res.jsonp(req.apocalypse);
};

/**
 * Update a Apocalypse
 */
exports.update = function(req, res) {
	var apocalypse = req.apocalypse ;

	apocalypse = _.extend(apocalypse , req.body);

	apocalypse.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(apocalypse);
		}
	});
};

/**
 * Delete an Apocalypse
 */
exports.delete = function(req, res) {
	var apocalypse = req.apocalypse ;

	apocalypse.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(apocalypse);
		}
	});
};

/**
 * List of Apocalypses
 */
exports.list = function(req, res) { 
	Apocalypse.find().sort('-created').populate('user', 'displayName').exec(function(err, apocalypses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(apocalypses);
		}
	});
};

/**
 * Apocalypse middleware
 */
exports.apocalypseByID = function(req, res, next, id) { 
	Apocalypse.findById(id).populate('user', 'displayName').exec(function(err, apocalypse) {
		if (err) return next(err);
		if (! apocalypse) return next(new Error('Failed to load Apocalypse ' + id));
		req.apocalypse = apocalypse ;
		next();
	});
};

/**
 * Apocalypse authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.apocalypse.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
