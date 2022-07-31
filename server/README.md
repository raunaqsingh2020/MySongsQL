# Small Queries

## Route 1: `/song GET`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Returns an array of the attributes listed below for the song with the given song id, used to display this information on a page specifically for this song

**Route Parameter(s):** None

**Query Parameter(s):** `id (String)`, the id of the song in our database

**Route Handler:** `song(req, res)`

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of { id (String), song_name (String), explicit (BOOLEAN), danceability (decimal), energy (decimal), key, loudness (decimal), mode (int), speechiness (decimal), acousticness (decimal), instrumentalness (decimal), liveness (decimal), valence (decimal), tempo (decimal), duration (int), time_signature (int), release_date (Date), max_streams (int)})}`
* Here id is the id of the song in our database, all other statistics are just numerical attributes of the song, and max_streams is the maximum number of streams that the song had on any chart in our database
* If id does not match a song, return an empty array

## Route 2: `/song_artists GET`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Returns a string of all of the artists that wrote the song with the given id, used to display this information on a page specifically for this song

**Route Parameter(s):** None

**Query Parameter(s):** `id (String)`, the id of the song in our database

**Route Handler:** `song_artists(req, res)`

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of {results (String)})}`

* Here the return parameter results is a string that contains all of the artists of a song, used to display in our application

## Route 3: `/artist_songs GET`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Returns the name and id of every song written by an artist, used to display this information on a page specifically for this artist

**Route Parameter(s):** None

**Query Parameter(s):** `id (String)`, the id of the artist in our database

**Route Handler:** `artist_songs(req, res)`

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of {name (String), id (String), year (int), artist_name (String)})}`

* Here the return parameters are the id, release year, and name of the song, and the name of the associated artist

## Route 4: `/artist_search GET`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Returns the name and id of every artist that matches the provided search by artist name

**Route Parameter(s):** None

**Query Parameter(s):** `name (String)`, the user search for an artist based on their name, `limit (int)* (default: 100)`, the number of search results that we want to limit the query to

**Route Handler:** `artist_search(req, res)`

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of {artist_name (String), id (String)})}`

* Here the return parameters are the id and name of each artist in the search

## Route 5: `/song_charts GET`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Returns an array of all the distinct charts and regions for the song with the given song id, used to display this information on a page specifically for this song, the return parameters match this exactly

**Route Parameter(s):** None

**Query Parameter(s):** `id (String)`, the id of the song in our database

**Route Handler:** `song(req, res)`

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of {chart (String), region (String)})}`

## Route 6: `/album GET`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Returns an array of the song ids and names of the songs in the album with the provided id, the return parameters match this exactly

**Route Parameter(s):** None

**Query Parameter(s):** id (String), the id of the album in our database

**Route Handler:** album(req, res)

**Return Type:** JSON
Return Parameters: {results (JSON array of {id (String), name (String)}

## Route 7: `/album_search GET`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Returns an array of album ids and album names for albums searched by name, the return parameters match this exactly

**Route Parameter(s):** None

**Query Parameter(s):** `page (int)*, pagesize (int)* (default: 10), name (string)*`
* Page and pagesize define the page we want to see and the number of entries on that page, respectively, name is the input for a search by album name

**Route Handler:** `album_search(req, res)`

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of { id (String), name (String)}) }`

**Expected Output Behavior:**

Case 1: If the page parameter (page) is defined
* Return albums with all the above return parameters for that page number by considering the page and pagesize parameters

Case 2: If the page parameter (page) is not defined
* Return all albums with the above return parameters

## Route 8: `/album_artists GET`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Returns a string of all of the artists for the album with the given id, used to display this information on a page specifically for this album

**Route Parameter(s):** None

**Query Parameter(s):** `id (String)`, the id of the album in our database

**Route Handler:** `album_artists(req, res)`

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of {results (String)})}`

* Here the return parameter results is a string that contains all of the artists of an album, used to display in our application

## Route 9: `/search_chart GET`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Returns a all chart information for the user provided chart and date

**Route Parameter(s):** None

**Query Parameter(s):** `chart (String) (default: ‘top200’)`, the chart being searched for, either viral50 or top200, `date (String) (default: ‘2017-01-01’)`, the date being searched for, `region (String) (default: ‘United States’)`, the region being searched for

**Route Handler:** `search_chart(req, res)`

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of {id (String), name (String), rank (int), date (String), region (String), chart, (String) trend (String), streams (int)})}`

* Here the return parameters are just the song id, name, rank, date, region, chart, trend, and streams of all songs that appear on the provided chart on the provided date

## Route 10: `/song_matching_attr GET`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Returns an array of songs where the specified attribute matches the provided song's attribute

**Route Parameter(s):** None

**Query Parameter(s):** `id (String)`, the id of the song in our database, `limit(int)* (default: 10)`, the number of search results that we want to limit the query to

**Route Handler:** `song_matching_attr(req, res)`

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of {song_id (String) and name (String)})}`

* Here the return parameters are the id of the similar song, and the name of the song

# Big/Complex Queries

## Route 11: `/search GET`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Returns an array of song ids, song names, release year, and song artist names for songs searched by artist name or song name, or both, used to search for a list of songs using the search functionality, the id of each song can then be used to link to a separate page for that specific song using Route 2 below

**Route Parameter(s):** None

**Query Parameter(s):** `page (int)*, pagesize (int)* (default: 10), artist (string)*, name (string)*, limit (int)* (default: 100)`

* Page and pagesize define the page we want to see and the number of entries on that page, respectively, artist is the input for a search by artist name, and name is the input for a search by song name. 
* Limit defines the number of search results that we want to limit the query to, which is useful since there are a massive number of songs in our database and displaying/querying for all of them 

**Route Handler:** `search(req, res)`

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of { id (String), song_name (String), artist_name (String), year (int)}) }`

**Expected (Output) Behavior:**

Case 1: If the page parameter (page) is defined

* Return song entries with all the above return parameters for that page number by considering the page and pagesize parameters
Case 2: If the page parameter (page) is not defined

* Return all songs with the above return parameters. If the page parameter is so large that it contains entries that do not exist, then return null for each entry that is out of bounds. The return parameters are the id of the song in our database, the name of the song, the year it was released, and the name of its associated artist.

**Pre-optimization timing:** 17 seconds

**Optimization Description:** In order to significantly speed up this query, an index was created on the name column in Songs, and in order for the index to be properly used, the WHERE S.name LIKE was changed to match starting from the beginning of the string instead of starting anywhere in the string using `LIKE '${name}%'`, given that the index sorts by name alphabetically, so if we matched for substrings within the whole string using `'%${name}%'` the index would effectively be useless.

**Post-optimization timing:** 0.7 seconds


## Route 12: `/similar GET`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Returns an array of song ids for the top 10 songs that are most similar to the song with the id provided compared across numerical statistics in the database

**Route Parameter(s):** None

**Query Parameter(s):** `id (String)`, the id of the song in our database, `limit(int)* (default: 10)`, the number of search results that we want to limit the query to

**Route Handler:** `similar(req, res)`

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of {song_id (String), similarity (decimal)})}`
* Here the return parameters are the id of the similar song, and the numerical value of its similarity metric

**Pre-optimization timing:** 21 seconds

**Optimization Description:** To speed up this query we pushed projections all the way down to reduce the sizes of intermediate joins, changed the join order to try and move smaller relations to the outer relation, filtered out songs that were not similar at all, and limited the size of the output. However, this could only bring the runtime down to about 5 seconds, specifically because the whole purpose of this query is to compare the selected song against every other song in our Songs table to find the most similar ones. This inherently requires 1.2 million comparisons, which is where most of the runtime of this query is contained, and if we were to try and reduce this further it would require us to fundamentally change the functionality of the query itself, making it so that this specific query cannot be optimized any further.

**Post-optimization timing:** 4.6 seconds

**Route 13:** `/album_similar GET`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Returns an array of album ids for the top 10 albums that are most similar to the album with the id provided, that were released in the same year as the album, based on the averages of the numerical statistics in the database for the songs in the album

**Route Parameter(s):** None

**Query Parameter(s):** `id (String)`, the id of the album in our database

**Route Handler:** `similar(req, res)`

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of {album_id (String), name (String), similarity (decimal)})}`

* Here the return parameters are the id of the similar album, the name of the similar album, and the numerical value of its similarity metric

**Pre-optimization timing:** Varied, but would sometimes run for upwards of 7 minutes

**Optimization Description:** At first this route was a full similarity comparison between every album to find similarity, but this takes a very long time to run, and so the optimization of limiting the albums examined to be in the same year as the album being examined was introduced, which significantly reduced the runtime by limiting the number of rows in the cross join. Also computed similarity for each song before merging. This reduced the size of the intermediate step, which improved the join efficiency.

**Post-optimization timing:** 4.1 seconds

## Route 14: `/artist_connections GET`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Returns all 1, 2, and 3 connection artists, as defined in homework 1, to the artist with the provided artist id, where N is the connection number

**Route Parameter(s):** None

**Query Parameter(s):** `id (String)`, the id of the artist in our database

**Route Handler:** `artist_connections(req, res)`

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of {name (String), id (String), N (int)})}`

* Name and id are the name and id of the artist with the connection to our original artist, and N is the connection number. So if the artist has a 1 connection to our original artist, then in that artist’s row N would be equal to 1

**Pre-optimization timing:** 36 seconds

**Optimization Description:** Reordered joins so the smaller relation was on the outside. Also added hash indices on both artist_id and song_id attributes in the Song_Artists relation.

**Post-optimization timing:** 1.7 seconds 

## Route 15: `/leaderboard GET`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Get a leaderboard of artists, ranked by their number of first-place rankings in any top 200 chart. Also display the number of first place finishes each artist had on any top 200 chart.

**Route Parameter(s):** None

**Query Parameter(s):** None

**Route Handler:** leaderboard(req, res)

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of {artist_id (String), name (String), first_place_count (int), total_streams (int)})}`
* Return parameters of the name and id of the artist on the leaderboard, the number of times they ranked first place in any top 200 chart, and their total number of streams

**Pre-optimization timing:** 16 seconds

**Optimization Description:** Reordered joins and pushed projections as far down as possible

**Post-optimization timing:** 0.2 seconds

# Extra Credit Login Queries

## Route 16: `/register POST`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Checks that a user with the given username does not yet exist, and then adds the user to the system as a register user

**Route Parameter(s):** None

**Query Parameter(s):** `username (String)`, the entered username, `password (String)`, the entered password

**Route Handler:** `register(req, res)`

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of {successful (Bool), error(String), loggedInUser (String)})}`

* Here successful is true if successfully registered and false otherwise, loggedInUser is the username of the user who just registered, and error is an error message if an error occurred.

## Route 17: `/login POST`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Checks that username and password are both correct, and if so logs the user into the application

**Route Parameter(s):** None

**Query Parameter(s):** `username (String)`, the entered username, `password (String)`, the entered password

**Route Handler:** `login(req, res)`

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of {successful (Bool), error(String), loggedInUser (String)})}`

* Here successful is true if successfully logged in and false otherwise, loggedInUser is the username of the user who just logged in, and error is an error message if an error occurred.

## Route 18: `/check_song_is_favorite GET`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Checks whether or not the given user has favorited the given song or not

**Route Parameter(s):** None

**Query Parameter(s):** `username (String)`, the username of the logged in user, `song_id (String)`, the id of the song being checked

**Route Handler:** `check_song_is_favorite(req, res)`

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of {successful (Bool), isFavorite (Bool)})}`

* Here successful is true if successfully checked and false otherwise, and isFavorite is true if the user has the song favorited and false otherwise.

## Route 19: `/get_favorite_songs GET`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Gets all the favorite songs of the logged in user

**Route Parameter(s):** None

**Query Parameter(s):** `username (String)`, the username of the logged in user, `limit (Int)`, the limit on the number of songs returned

**Route Handler:** `get_favorite_songs(req, res)`

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of { id (String), song_name (String), artist_name (String), year (int)}) }`

* Return all songs with the above return parameters. If the page parameter is so large that it contains entries that do not exist, then return null for each entry that is out of bounds. The return parameters are the id of the song in our database, the name of the song, the year it was released, and the name of its associated artist.

## Route 20: `/toggle_favorite_song POST`
-------------------------------------------------------------------------------------------------------------------------------
**Description:** Toggles the favorited status of the given song for the logged in user

**Route Parameter(s):** None

**Query Parameter(s):** `username (String)`, the username of the logged in user, `song_id (String)`, the id of the song being toggled, `is_favorited (Bool)`, whether or not the song is currently favorited

**Route Handler:** `toggle_favorite_song(req, res)`

**Return Type:** JSON

**Return Parameters:** `{results (JSON array of {successful (Bool), error(String), nowIsFavorite (Bool)})}`

* Here successful is true if successfully toggled and false otherwise, and nowIsFavorite is true if the user now has the song favorited and false otherwise, and error is an error message if an error occurred.
