const express = require('express');
const app = express();
const port = 4000;
const expressLayouts = require('express-ejs-layouts');
const Lesson = require('./model/lesson.js');
require('./utils/db.js');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(expressLayouts);
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.render('index', {
		title: 'Halaman Home',
		layout: 'layouts/main-layout',
	})
});

app.get('/pelajaran', async (req, res) => {
	const lessons = await Lesson.find();
	res.render('pelajaran', {
		title: 'Halaman jadwal pelajaran',
		layout: 'layouts/main-layout',
		lessons
	})
})

app.listen(port, () => {
	console.log(`app listening on http://localhost:${port}`);
});