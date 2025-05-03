import express from 'express';
import pg from 'pg';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import session from 'express-session';

const app = express();
const port = 3000;

const pool = new pg.Pool({
	host: 'localhost',
	port: 5432,
	user: 'postgres',
	password: 'root',
	database: 'itp303'
});

app.use(cors({
	origin: 'http://localhost:5173', // allow your frontend
	credentials: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
	secret: "randomly_generated_string_here", // Used to generate a unique ID
	resave: false, // Do not re-save session variables if variables did not change
	saveUninitialized: false // Do not create session variables for all visitors. We will create them ourselves
}))

app.get('/search', (req, res) => {
	try {
		const sql = `
			SELECT *
			FROM studymatch_db
		`
	} catch (error) {
		console.log("Server Error");
		res.json({ message: 'Server Error' });
	}
});

app.get('/api/groups', async (req, res) => {
	try {


		const departments = await pool.query(`
			SELECT *
			FROM studymatch_db.departments
		`);



		console.log(departments.rows);

		res.json(departments.rows);


	} catch (error) {
		console.log("Server Error");
		console.log(error);
		res.json({ message: 'Server Error' });
	}
});


app.get('/api/groups/:course_id', async (req, res) => {
	try {
		const id = parseInt(req.params.course_id);

		const groups = await pool.query(`
			SELECT *
			FROM studymatch_db.groups
			WHERE course_id = ${id};
		`);

		res.json(groups.rows);


	} catch (error) {
		console.log("Server Error");
		console.log(error);
		res.json({ message: 'Server Error' });
	}
});



app.get('/api/courses', async (req, res) => {
	try {
		const courses = await pool.query(`
			SELECT course_id, title, code, number
			FROM studymatch_db.courses
			LEFT JOIN studymatch_db.departments
				ON courses.department_id = departments.department_id; 
		`);

		console.log("request for courses");

		res.json(courses.rows);
	} catch (error) {
		console.log("Server Error");
		console.log(error);
		res.json({ message: 'Server Error' });
	}
});


// Authentication

app.post('/api/login', async (req, res) => {
	try {

		const { email, password } = req.body



		const sql = `
		SELECT *
		FROM studymatch_db.users
		WHERE email ILIKE $1;
	  `
		const values = [email]
		const results = await pool.query(sql, values)
		

		if (results.rows.length == 0) {
			res.json({
				error: "Invalid credentials"
			})
			return
		}

		// bcrypt.compare(user input / password, hashed value / psw from DB)
		const isPassCorrect = await bcrypt.compare(password, results.rows[0].password)

		// if (password != results.rows[0].password) {
		if (isPassCorrect == false) {
			res.json({
				error: "Invalid credentials"
			})
			return
		}


		req.session.user = {
			id: results.rows[0].user_id, // or whatever your primary key is
			email: results.rows[0].email
		};

		res.json({
			message: "Success"
		});

	} catch (error) {
		console.log(error);
		res.send('Server Error');
	}
});

app.get('/register', (req, res) => {
	res.render('registerForm');
});

app.post('/api/register', async (req, res) => {
	try {

		const { email, password } = req.body



		const sqlRegistered = `
		  SELECT *
		  FROM studymatch_db.users
		  WHERE email = $1;
		`
		const valuesRegistered = [email]

		const results = await pool.query(sqlRegistered, valuesRegistered)

		if (results.rows.length > 0) {
			res.json({
				error: "Username or email already registered."
			})
			return
		}

		// bcrypt.hash(string to be hashed, hash count)
		const hashedPassword = await bcrypt.hash(password, 10)

		const sql = `
		  INSERT INTO studymatch_db.users (email, password)
		  VALUES ($1, $2);
		`
		const values = [email, hashedPassword]

		await pool.query(sql, values)

		res.json({
			message: "Success"
		})

	} catch (error) {
		console.log(error);
		res.send('Server Error');
	}



});

app.get('/api/logout', (req, res) => {

	req.session.destroy(() => {
		res.json({ message: "Logged out successfully" });

	});
});

app.listen(port, () => {
	console.log(`Server is running at port ${port}`);
});