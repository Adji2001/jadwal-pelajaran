const mongoose = require('mongoose');

const Picket = mongoose.model('Picket', {
	day: String,
	schedule: Array,	
});

module.exports = Picket;