const host = 'http://localhost:'
const express = require('express');
const app = express();
const port = 4000;
const expressLayouts = require('express-ejs-layouts');
const Lesson = require('./model/lesson.js');
const Picket = require('./model/picket.js');
const Student = require('./model/student.js');
require('./utils/db.js');
const fs = require('fs');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

const methodOverride = require('method-override');

const formidable = require('formidable');
const mv = require('mv');

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
		imgBrand: `${host}${port}/img/adji.jpg`
	})
});

// halaman jadwal pelajaran
app.get('/pelajaran', async (req, res) => {
	const lessons = await Lesson.find();
	res.render('pelajaran', {
		title: 'Halaman jadwal pelajaran',
		layout: 'layouts/main-layout',
		lessons,
		msg: req.flash('info'),
		imgBrand: `${host}${port}/img/adji.jpg`
	})
});

// halaman tambah data pelajaran
app.get('/add', (req, res) => {
	res.render('add', {
		title: 'Halaman Tambah Pelajaran',
		layout: 'layouts/main-layout',
		msg: req.flash('info'),
		imgBrand: `${host}${port}/img/adji.jpg`,
		imgSide: `${host}${port}/img/add.png`
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
		lesson,
		imgBrand: `${host}${port}/img/adji.jpg`,
		imgChange: `${host}${port}/img/change.png`
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

// #################################################################
// #################################################################

// Halaman jadwal piket
app.get('/piket', async (req, res) => {
	const pickets = await Picket.find();
	res.render('piket', {
		title: 'Jadwal Piket',
		layout: 'layouts/main-layout',
		pickets,
		msg: req.flash('info'),
		imgBrand: `${host}${port}/img/adji.jpg`
	})
});

// Halaman tambah jadwal piket
app.get('/picket/add', async (req, res) => {
	res.render('addPicket', {
		title: 'Tambah Jadwal Piket',
		layout: 'layouts/main-layout',
		msg: req.flash('info'),
		imgBrand: `${host}${port}/img/adji.jpg`,
		imgSide: `${host}${port}/img/add.png`
	})
});

// proses tambah data piket
app.post('/addPicket', (req, res) => {
	const day = req.body.day;
	const lessons = req.body.lessons;
	const lesson = lessons.split(',');

	if(day == 'Pilih Hari') {
		req.flash('info', 'Silahkan pilih hari dulu');
		res.redirect('/picket/add');
	} else if(!lessons) {
		req.flash('info', 'Tambahkan jadwal dulu');
		res.redirect('/picket/add');
	} else {
		Picket.insertMany([{day, schedule: lesson}]);
		req.flash('info', 'Jadwal Piket berhasil ditambahkan');
		res.redirect('/piket');
	}
});

// Halaman edit jadwal piket
app.get('/picket/change/:_id', async (req, res) => {
	const picket = await Picket.findOne({_id: req.params._id});
	res.render('changePicket', {
		title: 'Edit Jadwal Piket',
		layout: 'layouts/main-layout',
		msg: req.flash('info'),
		picket,
		imgBrand: `${host}${port}/img/adji.jpg`,
		imgChange: `${host}${port}/img/change.png`,
	})
});

// Proses edit data piket
app.put('/changePicket', (req, res) => {
	const lesson = req.body.lessons;
	const less = lesson.split(',');
	Picket.updateOne({_id: req.body._id}, 
        {
            $set: {
                day: req.body.day,
                schedule: less,
            }
        },
        (error, result) => {
            // tambahkan flash message
            req.flash('info', 'Data berhasil diubah');
            res.redirect('/piket');
        }
    );
});

// proses delete data piket
app.delete('/piket', async (req, res) => {
	const lesson = await Picket.findOne({_id: req.body._id});

	if (!lesson) {
        res.status(400);
        res.send('<h1>404</h1>');
    } else {
        Picket.deleteOne(lesson, (error, result) => {
            // tambahkan flash message
            req.flash('info', 'Data berhasil dihapus');
            res.redirect('/piket');
        });
    }
});

// ############################################################
// ############################################################

// Halaman murid
app.get('/murid', async (req, res) => {
	const students = await Student.find();
	res.render('murid', {
		title: 'Halaman Murid',
		layout: 'layouts/main-layout',
		imgBrand: `${host}${port}/img/adji.jpg`,
		students,
		msg: req.flash('info')
	})
});

// Halaman tambah murid
app.get('/murid/add', async (req, res) => {
	res.render('addMurid', {
		title: 'Tambah Murid',
		layout: 'layouts/main-layout',
		imgBrand: `${host}${port}/img/adji.jpg`,
		msg: req.flash('info')
	})
});

// Proses tambah murid
app.post('/addMurid', (req, res, next) => {
	const form = formidable({multiples: true});

	form.parse(req, (err, fields, files) => {
		const nama = fields.nama;
		const quotes = fields.quotes;
		const role = fields.role;
		if (err) {
	      next(err);
	      return;
	    }
	    

	    // method utk cek type gambar
	    function inArray(needle, haystack) {
	        var length = haystack.length;
	        for(var i = 0; i < length; i++) {
	            if(haystack[i] == needle) return true;
	        }
	        return false;
	    }

	    let ekstesiGambarValid = ['jpg', 'jpeg', 'png', 'JPEG', 'PNG'];

	    const fileNama = files.foto.originalFilename;
	    const oldPath = files.foto.filepath;
	    const ekstensiGambar = files.foto.mimetype.split('/');
	    const newNama = `${files.foto.newFilename}.${ekstensiGambar[1]}`;
	    const newPath = __dirname + '/public/img/' + newNama;
	    const sizeGambar = files.foto.size;

	    // cek jika yg diupload bukan gambar
	    if (!inArray(ekstensiGambar[1], ekstesiGambarValid)) {
	    	req.flash('info', 'yang anda masukkan bukan gambar');
	    	res.redirect('/murid/add')
	    } else if(sizeGambar > 5000000) {
	      req.flash('info', 'ukurannya besar');
	      res.redirect('/murid/add')
	    } else {
		    mv(oldPath, newPath, (err) => {
		      if (err) { throw err; }
		      Student.insertMany([{foto: newNama, nama, quotes, role}])
		      // tambahkan flash message
		        req.flash('info', 'Data berhasil ditambah');
		        res.redirect('/murid');
		    });
	    }


	})
});

// Proses edit data murid

// Proses delete data murid
app.delete('/removeMurid', async (req, res) => {
	const student = await Student.findOne({_id: req.body._id});
	const image = student.foto;

	if (!student) {
        res.status(400);
        res.send('<h1>404</h1>');
    } else {
    	fs.unlink(`${__dirname}/public/img/${image}`, function(err) {
		    if(err && err.code == 'ENOENT') {
		        // file doens't exist
		        req.flash('info', "File doesn't exist, won't remove it.");
		        res.redirect('/murid');
		    } else if (err) {
		        // other errors, e.g. maybe we don't have enough permission
		        req.flash('info', "Error occurred while trying to remove file");
		        res.redirect('/murid');
		    } else {
		    	Student.deleteOne(student, (error, result) => {
		            // tambahkan flash message
		            req.flash('info', 'Data murid berhasil dihapus');
		            res.redirect('/murid');
		        });
		    }
		});
    }
})

// #############################################################
// #############################################################

app.use('/', (req, res) => {
	res.send('<h1>404</h1>')
});

app.listen(port, () => {
	console.log(`app listening on ${host}${port}`);
});