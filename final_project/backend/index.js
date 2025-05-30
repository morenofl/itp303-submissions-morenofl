import express from 'express';
import pg from 'pg';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;



const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false }
});

const pgSession = connectPgSimple(session);

app.set('trust proxy', 1); 

app.use(cors({
	origin: 'https://uscwebdev.github.io',
	credentials: true
}));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Origin', 'https://uscwebdev.github.io'); // Your frontend URL
	next();
  });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(session({
	store: new pgSession({
		pool: pool,                 // Connection pool
		tableName: 'session',        // Optional: defaults to 'session'
		createTableIfMissing: true
	}),
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		sameSite: 'none',
		secure: true
	}
}));





// Get all Departments
app.get('/api/departments', async (req, res) => {
	try {


		const departments = await pool.query(`
			SELECT *
			FROM studymatch_db.departments
		`);


		res.json(departments.rows);


	} catch (error) {
		console.log("Server Error");
		console.log(error);
		res.json({ message: 'Server Error' });
	}
});

// Insert group into groups table and userstudygroups table
app.post('/api/groups', async (req, res) => {
	try {


		const {
			name,
			course_id,
			meetingTime,
			description,
			contact,


		} = req.body;

		if (!req.session.user_id) {
			return res.status(401).json({ error: 'Not logged in' });
		}

		const creatorId = req.session.user_id

		const values = [
			name,
			course_id,
			1,
			meetingTime,
			description,
			contact,
			creatorId
		];

		const result = await pool.query(`
			INSERT INTO studymatch_db.groups
			(name, course_id, num_members, meeting_time, description, contact, created_by)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING *
		`, values);

		const groupId = result.rows[0].group_id;

		await pool.query(`
			INSERT INTO studymatch_db.user_study_groups
			(user_id, group_id)
			VALUES ($1, $2)
			
		`, [creatorId, groupId]);


		res.json({
			message: "Success",
			group: result.rows[0]
		})
	} catch (error) {
		console.log("Server Error");
		console.log(error);
		res.json({ message: 'Server Error' });
	}
});

//This user is joining this group
app.post('/api/userGroups', async (req, res) => {

	try {
		if (!req.session.user_id) {
			return res.status(401).json({ error: 'Not logged in' });
		}
		console.log(req.session.user_id);
		const userId = req.session.user_id;

		const { group_id } = req.body;

		await pool.query(`
			INSERT INTO studymatch_db.user_study_groups
				(user_id, group_id)
			VALUES
				($1, $2)
		`, [userId, group_id,]);

		await pool.query(`
			UPDATE studymatch_db.groups
			SET num_members = num_members + 1
			WHERE group_id = $1
		`, [group_id]);





		res.json({
			message: "success"
		})
	} catch (error) {
		console.log(error);
	}
});

// The user is leaving this group
app.delete('/api/userGroups/:group_id', async (req, res) => {
	try {
		const group_id = req.params.group_id;
		if (!req.session.user_id) {
			return res.status(401).json({ error: 'Not logged in' });
		}

		const userId = req.session.user_id;

		await pool.query(`
			DELETE FROM studymatch_db.user_study_groups
			WHERE user_id = $1 AND group_id = $2
		`, [userId, group_id]);

		await pool.query(`
			UPDATE studymatch_db.groups
			SET num_members = num_members - 1
			WHERE group_id = $1 AND num_members > 0
		`, [group_id]);





		res.json({
			message: "success"
		})
	} catch (error) {
		console.log(error);
	}
});

// Delete this group
app.delete('/api/groups/:group_id', async (req, res) => {
	try {
		const group_id = req.params.group_id;

		await pool.query(`
			DELETE FROM studymatch_db.user_study_groups
			WHERE group_id = $1
		`, [group_id]);

		await pool.query(`
			DELETE FROM studymatch_db.groups
			WHERE group_id = $1	
		`, [group_id]);



		res.json({
			message: "success"
		})
	} catch (error) {
		console.log(error);
	}
});

//Update this group
app.put('/api/groups/:group_id', async (req, res) => {
	try {
		const groupId = parseInt(req.params.group_id);
		const {
			name,
			course_id,
			meetingTime,
			description,
			contact
		} = req.body;

		await pool.query(`
		  UPDATE studymatch_db.groups
		  SET name = $1,
			  course_id = $2,
			  meeting_time = $3,
			  description = $4,
			  contact = $5
		  WHERE group_id = $6
		`, [name, course_id, meetingTime, description, contact, groupId]);

		res.json({ message: "Group updated successfully" });
	} catch (error) {
		console.error("Error updating group:", error);
		res.status(500).json({ error: "Server error" });
	}
});

// Get all groups with this id
app.get('/api/userGroups', async (req, res) => {

	try {
		console.log('Incoming session:', req.session);

		if (!req.session.user_id) {
			return res.status(401).json({ error: 'Not logged in' });
		}

		const userId = req.session.user_id;



		const user_groups = await pool.query(`
			SELECT *
			FROM studymatch_db.groups
			LEFT JOIN studymatch_db.user_study_groups
				ON groups.group_id = user_study_groups.group_id
			WHERE user_id = $1
		`, [userId]);




		res.json(user_groups.rows);
	} catch (error) {
		console.error("Error fetching user groups:", error);
		res.status(500).json({ error: "Server error" });
	}
});

// Get groups in the course id
app.get('/api/groups/:course_id', async (req, res) => {
	try {
		const id = parseInt(req.params.course_id);

		const groups = await pool.query(`
			SELECT *
			FROM studymatch_db.groups
			WHERE course_id = $1;
		`, [id]);


		res.json(groups.rows);


	} catch (error) {
		console.log("Server Error");
		console.log(error);
		res.json({ message: 'Server Error' });
	}
});

// Get all courses
app.get('/api/courses', async (req, res) => {
	try {
		const courses = await pool.query(`
			SELECT course_id, title, code, number
			FROM studymatch_db.courses
			LEFT JOIN studymatch_db.departments
				ON courses.department_id = departments.department_id; 
		`);



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


		req.session.user_id = results.rows[0].user_id;
		req.session.email = results.rows[0].email;

		

		req.session.save((err) => {
			if (err) {
				console.error("Session save error:", err);
				return res.json({ error: "Server error" });
			}
			console.log("Session saved successfully", req.session);
			return res.json({ message: "Success", user_id: results.rows[0].user_id, email: results.rows[0].email});
		});



	} catch (error) {
		console.log(error);
		res.send('Server Error');
	}
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

		const existingUser = await pool.query(sqlRegistered, valuesRegistered)

		if (existingUser.rows.length > 0) {
			res.json({
				error: "Username or email already registered."
			})
			return
		}

		// bcrypt.hash(string to be hashed, hash count)
		const hashedPassword = await bcrypt.hash(password, 10)

		const sql = `
		  INSERT INTO studymatch_db.users (email, password)
		  VALUES ($1, $2)
		  RETURNING *
		`
		const values = [email, hashedPassword]

		const newUser = await pool.query(sql, values)

		
		req.session.user_id = newUser.rows[0].user_id;
		req.session.email = newUser.rows[0].email;


		req.session.save((err) => {
			if (err) {
				console.error("Session save error:", err);
				return res.json({ error: "Server error" });
			}
			return res.json({
				message: "Success",
				user_id: newUser.rows[0].user_id,
				email: newUser.rows[0].email
			});
		});


	} catch (error) {
		console.log(error);
		res.json({message: "Server Error"});
	}



});


app.get('/api/protected', (req, res) => {
	if (!req.session.user_id) {
	  return res.status(401).json({ error: 'Not authenticated' });
	}
  
	return res.json({ message: 'You are logged in', user_id: req.session.user_id, email: req.session.user_id });
  });
  
app.get('/api/logout', (req, res) => {

	req.session.destroy(() => {
		res.json({ message: "Logged out successfully" });

	});
});

app.listen(port, () => {
	console.log(`Server is running at port ${port}`);
});