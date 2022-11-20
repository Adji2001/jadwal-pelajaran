const express = require('express');
const app = express();
const port = 4000;
const expressLayouts = require('express-ejs-layouts');

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

app.listen(port, () => {
	console.log(`app listening on http://localhost:${port}`);
});