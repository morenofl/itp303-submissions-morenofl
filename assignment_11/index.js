import express from 'express';
import pg from 'pg';

const app = express();
const port = 3000;

const pool = new pg.Pool({
	host: 'localhost',
	port: 5432,
	user: 'postgres',
	password: 'root',
	database: 'itp303'
  });
  
app.use(express.urlencoded({extended: false}));

app.get('/dvds', async (req, res) => {
	try {
		const sql = `
			SELECT *
			FROM dvd_db.dvd_titles;
		`;

		const results = await pool.query(sql);

		res.json({
			dvds: results.rows
		})
	} catch (error) {
		console.log(error);
		res.json({
			message: "Server Error"
		})
	}
});

app.get('/dvds/search', async (req, res) => {
	try {
		const dvdTitle = req.query.title;
		const award = req.query.award;

		let sql = `
			SELECT *
			FROM dvd_db.dvd_titles
			WHERE 1 = 1
		`

		if(dvdTitle !== undefined && dvdTitle.length > 0) {
			sql += ` AND title ILIKE '%${dvdTitle}%'`
		}

		if(award !== undefined && award.length > 0) {
			if(award == 'y' || award == 'Y') {
				sql += ` AND award IS NOT NULL`
			}
			else if(award == 'n' || award == 'N'){
				sql += ` AND award IS NULL`
			}
			
		}
		
		const results = await pool.query(sql);

		res.json({
			dvds: results.rows
		})
	} catch (error) {
		console.log(error);
		res.json({
			message: "Server Error"
		})
	}
});



app.get('/dvds/:id', async (req, res) => {
	try {
		const dvdId = parseInt(req.params.id);

		const sql = `
			SELECT *
			FROM dvd_db.dvd_titles
			WHERE dvd_title_id = ${dvdId}
		`

		const result = await pool.query(sql);

		res.json(result.rows[0]);
	} catch (error) {
		console.log(error);
		res.json({
			message: "Server Error"
		})
	}
});






app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});