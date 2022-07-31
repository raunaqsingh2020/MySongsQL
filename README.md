# MySongsQL

Collaborators: **@Dfeng6789 @irwin-deng @hryoma @raunaqsingh2020**

## About

Search songs to find statistics such as tempo, time signature, loudness, timber, as well as other more qualitative attributes, such as danceability and energy, and find songs that are most similar based on those qualities.

## Features

- Look up songs based on album, name, or artist
- Display song statistics such as whether or not it was on the Top 200 or Viral 50 charts, number of streams while on those charts, tempo, time signature, loudness, timber, as well as other more qualitative attributes like danceability and energy
- Displays similar songs based on those statistics
- Search for albums based on their name, and see all the songs in that album as well as similar albums
- Search for artists based on their name, and see all the songs they have written as well as connected artists
- Look up charts on different days and regions and display songs that were on that chart and the statistics for those songs
- Leaderboard of artists who have had the most finishes on a top 200 chart, and the total number of streams that their songs have
- Account creation and login: When logged in, users can favorite the songs that they see in our application, and this information is stored in our database. 
- Displays the top 10 search results on Bing for an artist on their page

## How to build the project locally

1. Download the project and all associated files. `cd` into the root of the project directory. From the main cis550-group-1 file directory in a terminal, `cd` into the server directory using `cd server`. From this directory, run `npm install` and then `npm run start`.

2. Once you have ensured that the server is running in this terminal, open a separate terminal, and then from the main cis550-group-1 file directory `cd` into the client directory using `cd client`. From this directory, run `npm install` and then `npm run start`. After the application has finished building it should automatically open up in your browser.

3. Our frontend is currently set up to communicate with our deployed backend on Heroku. To test locally, go to `client/src/config.json` and set prod to `false`, server_prefix to `"http"`, and server_host to `"127.0.0.1"`

4. In order to run tests, run `npm test` from within the server folder after running `npm install`

5. Frontend for our application is also deployed at [https://mysongsql.netlify.app/](https://mysongsql.netlify.app/), and backend is deployed at [https://mysongsql.herokuapp.com/](https://mysongsql.herokuapp.com/).
