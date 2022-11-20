const mongoose = require('mongoose');

const Lesson = mongoose.model('Lesson', {
	day: {
		type: String,
	},
	lessons: {
		type: Array,
	},
});

module.exports = Lesson;