import express from 'express';
import pg from 'pg';

const app = express();
const port = 3000;

const pool = new pg.Pool({
  
  host: 'dpg-d09vvr1r0fns73dueoj0-a.oregon-postgres.render.com',
  port: 5432,
  user: 'itpwebdev',
  password: 'DBPASSWORD',
  database: 'itp303_62so',
  ssl: true,
});

app.use(express.urlencoded({extended: false}));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/searchForm', async (req, res) => {

  try {
    const sql = `
      SELECT *
      FROM song_db.genres
    `;

    const results = await pool.query(sql);

    const mediaSql = `
      SELECT *
      FROM song_db.media_types
    `;

    const mediaResults = await pool.query(mediaSql);

    res.render('searchForm', {
      genres: results.rows,
      mediaTypes: mediaResults.rows
    });
  } catch (err) {
    console.log(err);
    res.send('Server Error');
  }
  
});

app.get('/searchResults', async (req, res) => {

  try {
    let sql = `
      SELECT tracks.name AS track,
        genres.name AS genre,
        media_types.name AS media_type,
        track_id
      FROM song_db.tracks
      LEFT JOIN song_db.genres
        ON genres.genre_id = tracks.genre_id
      LEFT JOIN song_db.media_types
        ON media_types.media_type_id = tracks.media_type_id
      WHERE 1 = 1
    `;

    const trackName = req.query.trackName;
    const genreId = req.query.genreId;
    const mediaTypeId = req.query.mediaTypeId;

    if ( typeof(trackName) !== "undefined" && trackName.length > 0 ) {
      sql += ` AND tracks.name ILIKE '%${trackName}%'`;
    }

    if ( typeof(genreId) !== "undefined" && genreId.length > 0 ) {
      sql += ` AND tracks.genre_id = ${genreId}`;
    }

    if ( typeof(mediaTypeId) !== "undefined" && mediaTypeId.length > 0 ) {
      sql += ` AND tracks.media_type_id = ${mediaTypeId}`;
    }

    sql += ` LIMIT 20`;

    const results = await pool.query(sql);

    res.render('searchResults', {
      results: results.rows
    });
  } catch (err) {
    console.log(err);
    res.send('Server Error');
  }
  
});

app.get('/addForm', async (req, res) => {
  try {
    const mediaSql = `
      SELECT *
      FROM song_db.media_types
    `;

    const genreSql = `
      SELECT *
      FROM song_db.genres
    `;

    const albumSql = `
      SELECT *
      FROM song_db.albums
    `;

    const mediaResults = await pool.query(mediaSql);
    const genreResults = await pool.query(genreSql);
    const albumResults = await pool.query(albumSql);

    res.render('addForm', {
      mediaTypes: mediaResults.rows,
      genres: genreResults.rows,
      albums: albumResults.rows
    });
  } catch (err) {
    console.log(err);
    res.send('Server Error');
  }
});

app.post('/addConfirm', async (req, res) => {

  try {
    const trackName = req.body.trackName;
    const mediaTypeId = req.body.mediaTypeId;
    const genreId = req.body.genreId;
    const milliseconds = req.body.milliseconds;
    const price = req.body.price;

    if (
      typeof(trackName) === "undefined" || trackName.length == 0
      || typeof(mediaTypeId) === "undefined" || mediaTypeId.length == 0
      || typeof(genreId) === "undefined" || genreId.length == 0
      || typeof(milliseconds) === "undefined" || milliseconds.length == 0
      || typeof(price) === "undefined" || price.length == 0
    ) {
      res.send('Please fill out all required fields.');
      return;
    }

    let albumId = req.body.albumId;
    let composer = req.body.composer;
    let bytes = req.body.bytes;

    if ( typeof(albumId) === "undefined" || albumId.length == 0 ) {
      albumId = `null`;
    }

    if ( typeof(bytes) === "undefined" || bytes.length == 0 ) {
      bytes = `null`;
    }

    if ( typeof(composer) === "undefined" || composer.length == 0 ) {
      composer = `null`;
    } else {
      composer = `'${composer}'`;
    }

    const sql = `
      INSERT INTO song_db.tracks
        (name, media_type_id, genre_id, milliseconds, unit_price, album_id, composer, bytes)
      VALUES (
        '${trackName}',
        ${mediaTypeId},
        ${genreId},
        ${milliseconds},
        ${price},
        ${albumId},
        ${composer},
        ${bytes}
      )
    `;

    const results = await pool.query(sql);

    res.render('addConfirm', {
      trackName: trackName
    });

  } catch (err) {
    console.log(err);
    res.send('Server Error');
  }
  
});

app.get('/track/:id', async (req, res) => {
  try {
    const trackId = parseInt(req.params.id);

    const sql = `
      SELECT tracks.name AS track,
        tracks.composer,
        tracks.milliseconds,
        tracks.bytes,
        tracks.unit_price,
        albums.title AS album,
        artists.name AS artist,
        genres.name AS genre
      FROM song_db.tracks
      LEFT JOIN song_db.albums
        ON albums.album_id = tracks.album_id
      LEFT JOIN song_db.artists
        ON artists.artist_id = albums.artist_id
      LEFT JOIN song_db.genres
        ON genres.genre_id = tracks.genre_id
      WHERE track_id = ${trackId}
    `;

    const results = await pool.query(sql);

    res.render('track', {
      track: results.rows[0]
    });

  } catch (err) {
    console.log(err);
    res.send('Server Error');
  }
});

app.get('/editForm/:trackId', async (req, res) => {
  try {

    const trackId = parseInt( req.params.trackId );

    const trackSql = `
      SELECT *
      FROM song_db.tracks
      WHERE track_id = ${trackId}
    `;

    const trackResults = await pool.query(trackSql);

    const genreSql = `
      SELECT *
      FROM song_db.genres
    `;

    const genreResults = await pool.query(genreSql);

    res.render('editForm', {
      genres: genreResults.rows,
      track: trackResults.rows[0]
    });
  } catch (err) {
    console.log(err);
    res.send('Server Error');
  }
});

app.post('/editConfirm', async (req, res) => {
  try {
    const trackId = req.body.trackId;
    const trackName = req.body.trackName;

    if (
      typeof(trackId) === "undefined" || trackId.length == 0
      || typeof(trackName) === "undefined" || trackName.length == 0
    ) {
      res.send('Please fill out all required fields.');
      return
    }

    let genreId = req.body.genreId;
    let composer = req.body.composer;

    if ( typeof(genreId) === "undefined" || genreId.length == 0 ) {
      genreId = `null`;
    }

    if ( typeof(composer) === "undefined" || composer.length == 0 ) {
      composer = `null`;
    } else {
      composer = `'${composer}'`;
    }

    const sql = `
      UPDATE song_db.tracks
      SET name = '${trackName}',
        genre_id = ${genreId},
        composer = ${composer}
      WHERE track_id = ${trackId}
    `;

    const results = await pool.query(sql);

    res.render('editConfirm', {
      trackName: trackName
    });
  } catch (err) {
    console.log(err);
    res.send('Server Error');
  }
});

app.get('/delete/:id/:trackName', async (req, res) => {
  try {
    const trackId = parseInt( req.params.id );

    const sql = `
      DELETE FROM song_db.tracks
      WHERE track_id = ${trackId}
    `;

    const results = await pool.query(sql);

    res.render('delete', {
      trackName: req.params.trackName
    });
  } catch (err) {
    console.log(err);
    res.send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});