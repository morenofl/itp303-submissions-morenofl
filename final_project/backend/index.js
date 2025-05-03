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
  }));

app.use(express.urlencoded({extended: false}));

app.get('/search', (req, res) => {
	try {
		const sql = `
			SELECT *
			FROM studymatch_db
		`
	} catch (error) {
		console.log("Server Error");
		res.json({message: 'Server Error'});
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
		res.json({message: 'Server Error'});
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
		res.json({message: 'Server Error'});
	}
});

app.post('api/register', async (req, res) => {
	const {email, password} = req.body;

	
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
		res.json({message: 'Server Error'});
	}
});


app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});