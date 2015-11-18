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
    date: {
      type: Date,
      default: new Date('1/1/3000')
    },
    imageUrl: {
      type: String,
      default: 'https://s3.amazonaws.com/rapgenius/filepicker/YaWfEptgQCuVgu0xd3EO_apocalypse.jpg'
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