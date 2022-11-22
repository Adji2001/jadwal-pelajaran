const express = require('express');
const app = express();
const port = 4000;
const expressLayouts = require('express-ejs-layouts');
const Lesson = require('./model/lesson.js');
require('./utils/db.js');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

const methodOverride = require('method-override');

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

app.use(methodOverride('_method'));

// halaman root
app.get('/', (req, res) => {
	res.render('index', {
		title: 'Halaman Home',
		layout: 'layouts/main-layout',
	})
});

// halaman jadwal pelajaran
app.get('/pelajaran', async (req, res) => {
	const lessons = await Lesson.find();
	res.render('pelajaran', {
		title: 'Halaman jadwal pelajaran',
		layout: 'layouts/main-layout',
		lessons,
		msg: req.flash('info')
	})
});

// halaman tambah data pelajaran
app.get('/add', (req, res) => {
	res.render('add', {
		title: 'Halaman Tambah Pelajaran',
		layout: 'layouts/main-layout',
		msg: req.flash('info')
	})
});

// proses tambah data pelajaran
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
});

// halaman edit data pelajaran
app.get('/change/:_id', async (req, res) => {
	const lesson = await Lesson.findOne({_id: req.params._id});
	res.render('change', {
		title: 'Edit Jadwal Pelajaran',
		layout: 'layouts/main-layout',
		msg: req.flash('info'),
		lesson
	})
})

// proses edit data pelajaran
app.put('/change', (req, res) => {
	const lesson = req.body.lessons;
	const less = lesson.split(',');
	Lesson.updateOne({_id: req.body._id}, 
        {
            $set: {
                day: req.body.day,
                lessons: less,
            }
        },
        (error, result) => {
            // tambahkan flash message
            req.flash('info', 'Data berhasil diubah');
            res.redirect('/pelajaran');
        }
    );
});

// proses delete data pelajaran
app.delete('/pelajaran', async (req, res) => {
	const lesson = await Lesson.findOne({_id: req.body._id});

	if (!lesson) {
        res.status(400);
        res.send('<h1>404</h1>');
    } else {
        Lesson.deleteOne(lesson, (error, result) => {
            // tambahkan flash message
            req.flash('info', 'Data berhasil dihapus');
            res.redirect('/pelajaran');
        });
    }
});

// Halaman jadwal piket
app.get('/piket', (req, res) => {
	res.render('piket', {
		title: 'Jadwal Piket',
		layout: 'layouts/main-layout',
	})
})

app.use('/', (req, res) => {
	res.send('<h1>404</h1>')
});

app.listen(port, () => {
	console.log(`app listening on http://localhost:${port}`);
});