const mongoose = require('mongoose');

const Picket = mongoose.model('Picket', {
	days: Array,
	day: String,
	schedule: Array,	
});

module.exports = Picket;