# Frontend Documentation

## config.json
Used to connect the frontend to the backend. 
* For the deployed production version of the server, set prod to `true` and server_host to `"mysongsql.herokuapp.com"`. 
* To test locally, set prod to `false`, server_prefix to `http`, and server_host to `"127.0.0.1"`

## fetcher.js
Fetcher used to communicate with the backend server, executing backend routes and returning the results to the frontend client

## index.js
Index used to route to the various pages of our application

## components/MenuBar.js
Menu Bar component that displays at the top of every page of our application

## pages/AlbumsPage.js
Page used to display albums, perform album search, display all songs in an album, and display similar albums

## pages/ArtistsPage.js
Page used to display artists, perform artist search, display all songs by an artist, and display connected artists

## pages/ChartsPage.js
Page used to display charts and perform chart search

## pages/FavoritesPage.js
Page used to the favorited songs of the logged in user

## pages/HomePage.js
Page used to display the home page of the application

## pages/LeaderboardPage.js
Page used to display the leaderboard of artists at the top of charts

## pages/SongsPage.js
Page used to display songs, perform song search, display the attributes of a song, and display similar songs
