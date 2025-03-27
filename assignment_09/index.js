import express from 'express';

const app = express();
const port = 3000;


// Set the view enginer to EJS
app.set('view engine', 'ejs');
//Set the folder where views are located
app.set('views', 'views');

// Sets the body-parser library to work with POST requests
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/search', (req, res) => {
	res.render('search', {
		formData: req.query,
	});
});

app.post('/register', (req, res)  => {
	res.render('register', {
		formData: req.body,
	});
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});