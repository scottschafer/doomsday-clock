'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Apocalypse Schema
 */
var ApocalypseSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Apocalypse name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Apocalypse', ApocalypseSchema);