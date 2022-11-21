const express = require('express');
const app = express();
const port = 4000;
const expressLayouts = require('express-ejs-layouts');
const Lesson = require('./model/lesson.js');
require('./utils/db.js');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(expressLayouts);
app.use(express.static('public'));

// konfigurasi flash message
app.use(cookieParser('secret'));
app.use(
    session({
        cookie: {maxAge: 6000},
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());

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
		lessons,
		msg: req.flash('info')
	})
});

app.get('/add', (req, res) => {
	res.render('add', {
		title: 'Halaman Tambah Pelajaran',
		layout: 'layouts/main-layout',
		msg: req.flash('info')
	})
})

app.post('/add', (req, res) => {
	const day = req.body.day;
	const lessons = req.body.lessons;
	const lesson = lessons.split(',');

	if(day == 'Pilih Hari') {
		req.flash('info', 'Silahkan pilih hari dulu');
		res.redirect('/add');
	} else if(!lessons) {
		req.flash('info', 'Tambahkan jadwal dulu');
		res.redirect('/add');
	} else {
		Lesson.insertMany([{day, lessons: lesson}]);
		req.flash('info', 'Jadwal Pelajaran berhasil ditambahkan');
		res.redirect('/pelajaran');
	}

})

app.use('/', (req, res) => {
	res.send('<h1>404</h1>')
})

app.listen(port, () => {
	console.log(`app listening on http://localhost:${port}`);
});