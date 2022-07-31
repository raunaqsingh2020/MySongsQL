const express = require('express');
const mysql = require('mysql');
var cors = require('cors')


const routes = require('./routes')
const config = require('./config.json')

const app = express();

app.use(cors());

app.get('/search', routes.search)
app.get('/song', routes.song)
app.get('/song_artists', routes.song_artists)
app.get('/artist_songs', routes.artist_songs)
app.get('/artist_search', routes.artist_search)
app.get('/song_charts', routes.song_charts)
app.get('/song_matching_attr', routes.song_matching_attr)
app.get('/similar', routes.similar)
app.get('/album_search', routes.album_search)
app.get('/album_artists', routes.album_artists)
app.get('/album', routes.album)
app.get('/album_similar', routes.album_similar)
app.get('/artist_connections', routes.artist_connections)
app.get('/leaderboard', routes.leaderboard)
app.get('/search_chart', routes.search_chart)
app.get('/check_song_is_favorite', routes.check_song_is_favorite)
app.get('/get_favorite_songs', routes.get_favorite_songs)
app.post('/register', routes.register)
app.post('/login', routes.login)
app.post('/toggle_favorite_song', routes.toggle_favorite_song)

const PORT = process.env.PORT || parseInt(config.server_port)
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});

module.exports = app;
