const mongoose = require('mongoose');

const Student = mongoose.model('Student', {
	foto: String,
	nama: String,
	quotes: String,
	role: String,	
});

module.exports = Student;