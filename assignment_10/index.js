import express from "express";
import pg from "pg";

const app = express();

const port = 3000;

// Set the view enginer to EJS
app.set('view engine', 'ejs');
//Set the folder where views are located
app.set('views', 'views');

const pool =  new pg.Pool({
	host: 'localhost',
  	port: 5432,
  	user: 'postgres',
  	password: 'root',
  	database: 'itp303'
});

// Sets the body-parser library to work with POST requests
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/searchForm', async (req, res) => {
	try {
		const sql = `
			SELECT *
			FROM dvd_db.genres
		`;

		const results = await pool.query(sql);

		// console.log(results.rows);

		const ratingSql = `
			SELECT *
			FROM dvd_db.ratings
		`;

		const ratingResults = await pool.query(ratingSql);
		// console.log(ratingResults.rows);
		res.render('search/searchForm', {
			genres: results.rows,
			ratings: ratingResults.rows
		});

	} catch (error) {
		console.log(error);
		res.send('Server Error');
	}

	
});

app.get('/searchResults', async (req, res) => {
	try {
		let sql = `
			SELECT 
				dvd_titles.dvd_title_id,
				dvd_titles.title AS title, 
				genres.genre AS genre, 
				ratings.rating AS rating, 
				dvd_titles.award AS award, 
				dvd_titles.release_date AS release_date
			FROM dvd_db.dvd_titles
			LEFT JOIN dvd_db.genres
				ON genres.genre_id = dvd_titles.genre_id
			LEFT JOIN dvd_db.ratings
				ON ratings.rating_id = dvd_titles.rating_id
			WHERE 1 = 1
		`

		const title = req.query.title;
		const genreId = req.query.genreId;
		const ratingId = req.query.ratingId;
		const award = req.query.award;
		const values = [];
		let paramIndex = 1;

		if(title !== undefined && title.length > 0) {
			sql += ` AND dvd_titles.title ILIKE $${paramIndex}`;
			values.push(`%${title}%`);
			paramIndex++;
		}

		if(genreId !== undefined && genreId.length > 0) {
			sql += ` AND dvd_titles.genre_id = $${paramIndex}`;
			values.push(parseInt(genreId));
			paramIndex++;
		}

		if(ratingId !== undefined && ratingId.length > 0) {
			sql += ` AND ratings.rating_id = $${paramIndex}`;
			values.push(parseInt(ratingId));
			paramIndex++;
		}

		if(award !== undefined && award.length > 0) {
		
			if(award == "yes") {
				sql += ` AND dvd_titles.award IS NOT NULL`
			}
			else if(award == "no") {
				sql += ` AND dvd_titles.award IS NULL`
			}
			else {

			}
		}
		
		sql += ` LIMIT 20`;
		// console.log(sql);
		const results = await pool.query(sql, values);

		// console.log(results.rows);



		res.render('search/searchResults', {
			results: results.rows
		});
	} catch (error) {
		console.log(error);
		res.send("Server Error");
	}
	
});

app.get('/addForm', async (req, res) => {
	try {
		const labelSql = `
			SELECT *
			FROM dvd_db.labels
		`;
		const labelResults = await pool.query(labelSql);

		const soundSql = `
			SELECT *
			FROM dvd_db.sounds
		`
		const soundResults = await pool.query(soundSql);

		const genreSql = `
			SELECT *
			FROM dvd_db.genres
		`;

		const genreResults = await pool.query(genreSql);

		// console.log(results.rows);

		const ratingSql = `
			SELECT *
			FROM dvd_db.ratings
		`;

		const ratingResults = await pool.query(ratingSql);
		
		const formatSql = `
			SELECT *
			FROM dvd_db.formats
		`;

		const formatResults = await pool.query(formatSql);

		res.render('add/addForm', {
			labels: labelResults.rows,
			sounds: soundResults.rows,
			genres: genreResults.rows,
			ratings: ratingResults.rows,
			formats: formatResults.rows
			
		});

		
	} catch (error) {
		console.log(error);
		res.send("Server Error");
	}
	
});

app.post('/addConfirm', async (req, res) => {
	try {
		const title = req.body.title;
		

		if(title === undefined || title.length == 0) {
			res.send('Please fill out all required fields.');
			return;
		}

		let releaseDate = req.body.releaseDate;
		let labelId = req.body.labelId;
		let soundId = req.body.soundId;
		let genreId = req.body.genreId;
		let ratingId = req.body.ratingId;
		let formatId = req.body.formatId;
		let award = req.body.award;

		if(releaseDate === undefined || releaseDate.length == 0) {
			releaseDate = null;
		}
		if(labelId === undefined || labelId.length == 0) {
			labelId = null;
		}
		if(soundId === undefined || soundId.length == 0) {
			soundId = null;
		}
		if(genreId === undefined || genreId.length == 0) {
			genreId = null;
		}
		if(ratingId === undefined || ratingId.length == 0) {
			ratingId = null;
		}
		if(formatId === undefined || formatId.length == 0) {
			formatId = null;
		}
		if(award === undefined || award.length == 0) {
			award = null;
		}

		const sql = `
			INSERT INTO dvd_db.dvd_titles
				(title, release_date, award, label_id, sound_id, genre_id, rating_id, format_id)
			VALUES(
				$1,
				$2,
				$3,
				$4,
				$5,
				$6,
				$7,
				$8

			)
		`;	
		const values = [
			title,
			releaseDate,
			award,
			labelId,
			soundId,
			genreId,
			ratingId,
			formatId
		]
		const results = await pool.query(sql, values);

		res.render('add/addConfirm', {
			title: title
		});
	} catch (error) {
		console.log(error);
		res.send("Sever Error");
	}
	
});

app.get('/dvd/:id', async (req, res) => {
	try {
		const titleId = parseInt(req.params.id);

		let sql = `
			SELECT 
				dvd_titles.dvd_title_id,
				dvd_titles.title AS title, 
				dvd_titles.release_date AS release_date,
				genres.genre AS genre, 
				labels.label AS label,
				ratings.rating AS rating,
				sounds.sound AS sound,
				formats.format AS format,
				dvd_titles.award AS award
			FROM dvd_db.dvd_titles
			LEFT JOIN dvd_db.genres
				ON genres.genre_id = dvd_titles.genre_id
			LEFT JOIN dvd_db.labels
				ON labels.label_id = dvd_titles.label_id
			LEFT JOIN dvd_db.ratings
				ON ratings.rating_id = dvd_titles.rating_id
			LEFT JOIN dvd_db.sounds
				ON sounds.sound_id = dvd_titles.sound_id
			LEFT JOIN dvd_db.formats
				ON formats.format_id = dvd_titles.format_id
			WHERE dvd_titles.dvd_title_id = ${titleId}
		`

		const results = await pool.query(sql);
		// console.log(results.rows[0]);
		res.render('dvd', {
			dvd: results.rows[0]
		});
	} catch (error) {
		console.log(error);
		res.send("Sever Error");
	}
	
});

app.get('/editForm/:id', async (req, res) => {
	try {
		const titleId = parseInt(req.params.id);
		const sql = `
			SELECT 
				dvd_title_id,
				title,
				genre_id,
				rating_id,
				award
			FROM dvd_db.dvd_titles
			WHERE dvd_titles.dvd_title_id = ${titleId}
		`
		const dvdResults = await pool.query(sql);

		const genreSql = `
			SELECT *
			FROM dvd_db.genres
		`;

		const genreResults = await pool.query(genreSql);

		// console.log(results.rows);

		const ratingSql = `
			SELECT *
			FROM dvd_db.ratings
		`;

		const ratingResults = await pool.query(ratingSql);
		// console.log(dvdResults.rows);

		res.render('edit/editForm', {
			dvd: dvdResults.rows[0],
			genres: genreResults.rows,
			ratings: ratingResults.rows
		});
	} catch (error) {
		console.log(error);
		res.send("Server Error");
	}
	
});

app.post('/editConfirm', async (req, res) => {
	try {

		let {dvdId, title, genreId, ratingId, award} = req.body;
		

		if(title === undefined || title.length == 0) {
			res.send('Please fill out all required fields.');
			return;
		}

		
		
		if(genreId === undefined || genreId.length == 0) {
			genreId = null;
		}
		if(ratingId === undefined || ratingId.length == 0) {
			ratingId = null;
		}
		if(award === undefined || award.length == 0) {
			award = null;
		}

		const sql = `
			UPDATE dvd_db.dvd_titles
			SET title = $1,
				genre_id = $2,
				rating_id = $3,
				award = $4
			WHERE dvd_title_id = $5
		`
		const values = [
			title,
			genreId,
			ratingId,
			award, 
			dvdId
		]

		const results = await pool.query(sql, values);

		res.render('edit/editConfirm', {
			title
		});
	} catch (error) {
		console.log(error);
		res.send("Server Error");
	}
	
});

app.get('/delete/:id/:title', async (req, res) => {
	try {
		const titleId = parseInt(req.params.id);
	
		const sql = `
			DELETE
			FROM dvd_db.dvd_titles
			WHERE dvd_title_id = $1
		`
		const values = [titleId];
		
		await pool.query(sql, values);

		res.render('delete', {
			title: req.params.title
		});
	} catch (error) {
		console.log(error);
		res.send("Server Error");
	}
	
})

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});