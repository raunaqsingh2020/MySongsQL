const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();

function fixStringInput(string) {
    if (string === "null") {
        return null
    }
    string = string.replace(/'/g, "\\'")
    string = string.replace(/_/g, "\\_")
    string = string.replace(/%/g, "\\%")

    return string
}

// Returns an array of the numerical attributes listed below for the song with the given song id
async function song(req, res) {
    let id = req.query.id;
    let queryString = `SELECT S.id, S.name AS song_name, S.explicit, S.danceability, S.energy, S.key, 
    S.loudness, S.mode, S.speechiness, S.acousticness, S.instrumentalness, S.liveness, S.valence, S.tempo, S.duration, 
    S.time_signature, S.release_date, MAX(C.streams) AS max_streams
    FROM Songs S
        LEFT OUTER JOIN Charts C
            ON S.id = C.song_id
    WHERE S.id = '${id}'
    `
    connection.query(queryString, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ "error" : error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

// Returns a string containing all of the artists for the song with the given id
async function song_artists(req, res) {
    let id = req.query.id;
    let queryString = `SELECT S.id AS song_id, A.name AS artist_name, A.ID AS artist_id, S.name AS song_name
    FROM Songs S
        JOIN Song_Artists SA
            ON S.id = SA.song_id
        JOIN Artists A
            ON A.id = SA.artist_id
    WHERE S.id = '${id}'
    `
    connection.query(queryString, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ "error" : error })
        } else if (results) {
            artist_string = ""
            for (var i = 0; i < results.length; i++) {
                if (results.length == 1) {
                    artist_string = results[i].artist_name
                } else if (results.length == 2) {
                    if (i == 0) {
                        artist_string = results[i].artist_name
                    } else {
                        artist_string = artist_string + " and " + results[i].artist_name
                    }
                } else if (i == results.length - 1) {
                    artist_string = artist_string + "and " +  results[i].artist_name
                } else {
                    artist_string = artist_string + results[i].artist_name + ", "
                }
            }
            res.json({ results: artist_string })
        }
    });
}

// Returns all of the songs that a particular artist with the provided artist id has written
async function artist_songs(req, res) {
    let id = req.query.id ? req.query.id : "";
    let limit = req.query.limit ? req.query.limit : 100;
    let queryString = `SELECT S.name, S.id, S.year, A.name AS artist_name 
    FROM Songs S 
    JOIN Song_Artists SA
        ON S.id = SA.song_id
    JOIN Artists A
        ON A.id = SA.artist_id
    WHERE A.id = '${id}'
    LIMIT ${limit}
    `

    if (req.query.page && !isNaN(req.query.page)) {
        connection.query(queryString, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ "error" : error })
            } else if (results) {
                let pagesize = req.query.pagesize ? req.query.pagesize : 10
                let returnedResults = [];
                let start = (parseInt(req.query.page) - 1) * parseInt(pagesize);

                for (let i = start; i < start + parseInt(pagesize); i++) {
                    returnedResults.push(results[i]);
                }
                res.json({ results: returnedResults })
            }
        });
    } else {
        connection.query(queryString, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ "error" : error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// Returns the id and name of every artist that matches the given name search, allows the user to search for artists by name
async function artist_search(req, res) {
    let name = req.query.name ? fixStringInput(req.query.name) : "";
    let limit = req.query.limit ? req.query.limit : 100;
    let queryString = `SELECT A.id, A.name AS artist_name 
    FROM Artists A
    WHERE A.name LIKE '%${name}%'
    LIMIT ${limit}
    `

    if (req.query.page && !isNaN(req.query.page)) {
        connection.query(queryString, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ "error" : error })
            } else if (results) {
                let pagesize = req.query.pagesize ? req.query.pagesize : 10
                let returnedResults = [];
                let start = (parseInt(req.query.page) - 1) * parseInt(pagesize);

                for (let i = start; i < start + parseInt(pagesize); i++) {
                    returnedResults.push(results[i]);
                }
                res.json({ results: returnedResults })
            }
        });
    } else {
        connection.query(queryString, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ "error" : error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// Returns an array of all the distinct charts and regions for the song with the given song id
async function song_charts(req, res) {
    let id = req.query.id;
    let queryString = `SELECT DISTINCT chart, region
    FROM Charts
    WHERE song_id = '${id}'
    `
    connection.query(queryString, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ "error" : error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

// Returns an array of the song ids and names of the songs in the album with the provided id
async function album(req, res) {
    let id = req.query.id;
    let queryString = `SELECT S.id, S.name, A.name AS album_name
    FROM Albums A
        JOIN Songs S
            ON S.album_id = A.id
    WHERE A.id = '${id}'
    `
    connection.query(queryString, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ "error" : error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

// Returns an array of album ids and album names for albums searched by name
async function album_search(req, res) {
    let name = req.query.name ? fixStringInput(req.query.name) : "";
    let limit = req.query.limit ? req.query.limit : 100;
    let queryString = `SELECT id, name
    FROM Albums
    WHERE name LIKE '%${name}%'
    LIMIT ${limit}
    `

    if (req.query.page && !isNaN(req.query.page)) {
        connection.query(queryString, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ "error" : error })
            } else if (results) {
                let pagesize = req.query.pagesize ? req.query.pagesize : 10
                let returnedResults = [];
                let start = (parseInt(req.query.page) - 1) * parseInt(pagesize);
                for (let i = start; i < parseInt(start) + parseInt(pagesize); i++) {
                    returnedResults.push(results[i]);
                }
                res.json({ results: returnedResults })
            }
        });
    } else {
        connection.query(queryString, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ "error" : error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// Returns a string containing all of the artists for the album with the given id
async function album_artists(req, res) {
    let id = req.query.id;
    let queryString = `WITH song AS (SELECT S.id 
        FROM Songs S
        WHERE album_id = '${id}'
        LIMIT 1)
        SELECT A.name
        FROM song S
        JOIN Song_Artists SA
            ON S.id = SA.song_id
        JOIN Artists A
            ON SA.artist_id = A.id
    `
    connection.query(queryString, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ "error" : error })
        } else if (results) {
            artist_string = ""
            for (var i = 0; i < results.length; i++) {
                if (results.length == 1) {
                    artist_string = results[i].name
                } else if (results.length == 2) {
                    if (i == 0) {
                        artist_string = results[i].name
                    } else {
                        artist_string = artist_string + " and " + results[i].name
                    }
                } else if (i == results.length - 1) {
                    artist_string = artist_string + "and " +  results[i].name
                } else {
                    artist_string = artist_string + results[i].name + ", "
                }
            }
            res.json({ results: artist_string })
        }
    });
}

// Returns a list of songs on the given chart on the given day
async function search_chart(req, res) {
    let chart = req.query.chart ? req.query.chart : "top200";
    let date = req.query.date ? req.query.date : "";
    let region = req.query.region ? req.query.region : "";
    let queryString = `SELECT S.id, S.name, C.rank, C.date, C.region, C.chart, C.trend, C.streams
    FROM Songs S
        JOIN Charts C
            ON S.id = C.song_id
    WHERE C.date LIKE '%${date}%' AND C.chart = '${chart}' AND C.region LIKE '%${region}%'
    `
    connection.query(queryString, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ "error" : error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

// Finds songs that have the same value in the user selected attribute as a similarity suggestion
async function song_matching_attr(req, res) {
  let id = req.query.id;
  let attr = req.query.attr ? req.query.attr : 'danceability';
  let limit = req.query.limit ? req.query.limit : 10;
  let queryString = ` WITH artists AS (
      SELECT S.id, S.name, year, artist_id, A.name AS artist_name
      FROM (SELECT ${attr}
          FROM Songs
          WHERE id = '${id}') T
      JOIN Songs S 
      ON (S.${attr} = T.${attr}) AND (S.id <> '${id}')
      JOIN Song_Artists SA ON SA.song_id = S.id
      JOIN Artists A on A.id = SA.artist_id
      LIMIT ${limit})
      SELECT id, name, year, artist_id, MAX(artist_name) AS artist_name
      FROM artists
      GROUP BY id, name, year
  ` 
  connection.query(queryString, function (error, results, fields) {
      if (error) {
          console.log(error)
          res.json({ "error" : error })
      } else if (results) {
        if (results.length == 0) {
            new_results = [{"name": "No Similar Songs"}]
            res.json({ results: new_results })
        } else {
            res.json({ results: results })
        }
      }
  });
}

// Returns an array of song ids, song names, release year, and song artist names for songs searched by artist name or song name, or both
async function search(req, res) {
    let artist = req.query.artist ? fixStringInput(req.query.artist) : "";
    let name = req.query.name ? fixStringInput(req.query.name) : "";
    let limit = req.query.limit ? req.query.limit : 100;
    let queryString = `WITH limited_songs AS (SELECT S.id, S.name, S.year, A.name AS artist_name, A.id AS artist_id
    FROM (SELECT * FROM Songs S WHERE name LIKE '%${name}%') S
        JOIN Song_Artists SA
            ON S.id = SA.song_id
        JOIN (SELECT * FROM Artists WHERE name LIKE '%${artist}%') A
            ON A.id = SA.artist_id
    WHERE A.name LIKE '%${artist}%' AND S.name LIKE '${name}%'
    LIMIT ${limit})
    SELECT id, name, year, artist_id, MAX(artist_name) AS artist_name
    FROM limited_songs
    GROUP BY id, name, year
    `

    if (req.query.page && !isNaN(req.query.page)) {
        connection.query(queryString, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ "error" : error })
            } else if (results) {
                let pagesize = req.query.pagesize ? req.query.pagesize : 10
                let returnedResults = [];
                let start = (parseInt(req.query.page) - 1) * parseInt(pagesize);

                for (let i = start; i < start + parseInt(pagesize); i++) {
                    returnedResults.push(results[i]);
                }
                res.json({ results: returnedResults })
            }
        });
    } else {
        connection.query(queryString, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ "error" : error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// Returns an array of song ids for the top 10 songs that are most similar to the song with the id provided compared across
// numerical statistics in the database
async function similar(req, res) {
  let id = req.query.id;
  let targetQuery = `
      SELECT *
      FROM Songs
      WHERE id = '${id}'
  `
  var energy, danceability, loudness, speechiness, acousticness, instrumentalness, liveness, valence, tempo
  connection.query(targetQuery, function (error, results, fields) {
      if (error) {
          console.log(error)
          res.json({ "error" : error })
      } else if (results && id) {
          try {
              energy = results[0].energy
              danceability = results[0].danceability
              loudness = results[0].loudness
              speechiness = results[0].speechiness
              acousticness = results[0].acousticness
              instrumentalness = results[0].instrumentalness
              liveness = results[0].liveness
              valence = results[0].valence
              tempo = results[0].tempo
          } catch (error1) {
              console.log(error1)
              res.json({ "error" : error1})
              return
          }

          let limit = req.query.limit ? req.query.limit : 10;
          let queryString = `WITH similar AS (SELECT id, name, year,
                  100 - ( ABS(energy - ${energy}) + ABS(danceability - ${danceability}) +
                  ABS(loudness - ${loudness})/70 + ABS(speechiness - ${speechiness}) + ABS(acousticness - ${acousticness}) +
                  ABS(instrumentalness - ${instrumentalness}) + ABS(liveness - ${liveness}) + ABS(valence - ${valence}) +
                  ABS(tempo - ${tempo})/250 )*100/9 AS similarity
              FROM Songs 
              WHERE (ABS(energy - ${energy}) < 0.15) AND (ABS(danceability - ${danceability}) < 0.15)
                  AND (ABS(loudness - ${loudness}) < 5) AND (ABS(speechiness - ${speechiness}) < 0.15)
                  AND (ABS(acousticness - ${acousticness}) < 0.15) AND (ABS(instrumentalness - ${instrumentalness}) < 0.15)
                  AND (ABS(liveness - ${liveness}) < 0.15) AND (ABS(valence - ${valence}) < 0.15)
                  AND (ABS(tempo - ${tempo}) < 40) AND (id <> '${id}')
              ORDER BY similarity DESC
              LIMIT ${limit}), artists AS
              (SELECT S.id, S.name, year, A.id AS artist_id, A.name AS artist_name
              FROM similar S JOIN Song_Artists SA
                ON S.id = SA.song_id
              JOIN Artists A
                ON SA.artist_id = A.id)
            SELECT id, name, year, artist_id, MAX(artist_name) AS artist_name
            FROM artists
            GROUP BY id, name, year
          ` 
          connection.query(queryString, function (error, results, fields) {
              if (error) {
                  console.log(error)
                  res.json({ "error" : error })
              } else if (results) {
                  res.json({ results: results })
              }
          });
      }
  });
}

// Returns an array of album ids for the top 10 albums that are most similar to the album with the id provided
async function album_similar(req, res) {
  let id = req.query.id;
    let queryString = `
    WITH avg_scores AS (
      SELECT A.id, A.name,
          AVG(S.energy) AS avg_energy,
          AVG(S.danceability) AS avg_danceability,
          AVG(S.loudness) AS avg_loudness,
          AVG(S.speechiness) AS avg_speechiness,
          AVG(S.acousticness) AS avg_acousticness,
          AVG(S.instrumentalness) AS avg_instrumentalness,
          AVG(S.liveness) AS avg_liveness,
          AVG(S.valence) AS avg_valence,
          AVG(S.tempo) AS avg_tempo
      FROM Albums A
          JOIN Songs S
              ON A.id = S.album_id
      WHERE S.year = (SELECT S.year FROM Songs S JOIN Albums A ON A.id = S.album_id WHERE A.id = '${id}' LIMIT 1)
      GROUP BY S.album_id),
    target AS ( SELECT *
        FROM avg_scores
        WHERE id = '${id}')
    SELECT A1.id, A1.name, ABS(A1.avg_energy - A2.avg_energy) +
        ABS(A1.avg_danceability - A2.avg_danceability) +
        ABS(A1.avg_loudness - A2.avg_loudness) +
        ABS(A1.avg_speechiness - A2.avg_speechiness) +
        ABS(A1.avg_acousticness - A2.avg_acousticness) +
        ABS(A1.avg_instrumentalness - A2.avg_instrumentalness) +
        ABS(A1.avg_liveness - A2.avg_liveness) +
        ABS(A1.avg_valence - A2.avg_valence) +
        ABS(A1.avg_tempo - A2.avg_tempo) AS similarity
    FROM target A2 JOIN avg_scores A1 
    ON A1.id <> A2.id
    ORDER BY similarity ASC
    LIMIT 10;
    `
    connection.query(queryString, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ "error" : error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}

// Returns all 1, 2, and 3 connection artists, as defined in homework 1, to the artist with the provided artist id
async function artist_connections(req, res) {
    let id = req.query.id;
    let limit = req.query.limit ? req.query.limit : 100;
    let queryString = `
        WITH Zero_Connection_Artists AS (
            SELECT DISTINCT id as artist_id, 0 AS N
            FROM Artists
            WHERE id = '${id}' ),
        One_Connection_Songs AS (
            SELECT DISTINCT SA.song_id
            FROM Zero_Connection_Artists A0
                INNER JOIN Song_Artists SA
                    ON A0.artist_id = SA.artist_id),
        One_Connection_Artists AS (
            SELECT DISTINCT SA.artist_id, 1 AS N
            FROM One_Connection_Songs S1
                INNER JOIN Song_Artists SA
                    ON S1.song_id = SA.song_id 
                        AND SA.artist_id NOT IN (
                            SELECT A0.artist_id
                            FROM Zero_Connection_Artists A0 ) ),
        Two_Connection_Songs AS (
            SELECT DISTINCT SA.song_id
            FROM One_Connection_Artists A1
                INNER JOIN Song_Artists SA
                    ON A1.artist_id = SA.artist_id ),
        Two_Connection_Artists AS (
            SELECT DISTINCT SA.artist_id, 2 AS N
            FROM Two_Connection_Songs S2
                INNER JOIN Song_Artists SA
                    ON S2.song_id = SA.song_id 
                        AND SA.artist_id NOT IN (
                            SELECT A0.artist_id
                            FROM Zero_Connection_Artists A0 )
                        AND SA.artist_id NOT IN (
                            SELECT A1.artist_id
                            FROM One_Connection_Artists A1 ) ),
        Three_Connection_Songs AS (
            SELECT DISTINCT SA.song_id
            FROM Two_Connection_Artists A2
                INNER JOIN Song_Artists SA
                    ON A2.artist_id = SA.artist_id ),
        Three_Connection_Artists AS (
            SELECT DISTINCT SA.artist_id, 3 AS N
            FROM Three_Connection_Songs S3
                INNER JOIN Song_Artists SA
                    ON S3.song_id = SA.song_id 
                        AND SA.artist_id NOT IN (
                            SELECT A0.artist_id
                            FROM Zero_Connection_Artists A0 )
                        AND SA.artist_id NOT IN (
                            SELECT A1.artist_id
                            FROM One_Connection_Artists A1 )
                        AND SA.artist_id NOT IN (
                            SELECT A2.artist_id
                            FROM Two_Connection_Artists A2 ) )
    SELECT Artists.name, Artists.id, Connected_Artists.N
    FROM (
          SELECT *
          FROM One_Connection_Artists
      UNION
          SELECT *
          FROM Two_Connection_Artists
      UNION
          SELECT *
          FROM Three_Connection_Artists
    ) Connected_Artists
    INNER JOIN Artists
        ON Connected_Artists.artist_id = Artists.id
    LIMIT ${limit};
    `
    connection.query(queryString, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ "error" : error })
        } else if (results) {
            if (results.length == 0) {
                new_results = [{"name": "No Connections"}]
                res.json({ results: new_results })
            } else {
                res.json({ results: results })
            }
        }
    });
}

// Gets a leaderboard of artists, ranked by their number of first-place rankings in any top 200 chart. 
// Also displays the number of first place finishes each artist had on any top 200 chart.
async function leaderboard(req, res) {
    let queryString = `WITH Song_Streams AS (
            SELECT song_id, SUM(streams) as song_streams
            FROM Charts
            WHERE chart = 'top200'
            GROUP BY song_id ),
        Song_First_Places AS (
            SELECT song_id, COUNT(*) as song_1_count
            FROM Charts
            WHERE (chart = 'top200'
                AND \`rank\` = 1)
            GROUP BY song_id),
        Song_Stats AS (
            SELECT S.song_id, S.song_streams, F.song_1_count
            FROM Song_Streams S
            INNER JOIN Song_First_Places F
                ON S.song_id = F.song_id ),
        Song_Artist_Names AS (
            SELECT SA.song_id, SA.artist_id, A.name
            FROM Song_Artists SA
            INNER JOIN Artists A
                ON SA.artist_id = A.id )
    SELECT A.artist_id, A.name, SUM(S.song_1_count) as first_place_count, SUM(S.song_streams) as total_streams
    FROM Song_Artist_Names A
    INNER JOIN Song_Stats S
        ON S.song_id = A.song_id
    GROUP BY A.artist_id
    ORDER BY first_place_count DESC;
    `
    connection.query(queryString, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ "error" : error })
        } else if (results) {
            res.json({ results: results })
        }
    });
}


// User login queries

// Checks that a user with the given username does not yet exist, and then adds the user to the system as a register user
async function register(req, res) {
    let username = req.query.username
    let password = req.query.password

    let duplicateUsernameQueryString = `
        SELECT *
        FROM Login_Info
        WHERE username = '${username}'
    `
    connection.query(duplicateUsernameQueryString, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ "successful" : false, "error" : error, "loggedInUser" : null })
        } else if (results) {
            if (results.length > 0) {
                res.json({ "successful" : false, "error" : "Username already exists!", "loggedInUser" : null})
                return;
            }

            let loginCreationQueryString = `
                INSERT INTO Login_Info(username, password)
                VALUES ('${username}', '${password}')
            `
            connection.query(loginCreationQueryString, function (error, results, fields) {
                if (error) {
                    console.log(error)
                    res.json({ "successful" : false, "error" : error, "loggedInUser" : null })
                } else if (results) {
                    if (results.affectedRows > 0) {
                        res.json({ "successful" : true, "loggedInUser" : username })
                    } else {
                        res.json({ "successful" : false, "error" : "Database update was unsuccessful", "loggedInUser" : null })
                    }
                }
            });
        }
    });
}

// Checks that username and password are both correct, and if so logs the user into the application
async function login(req, res) {
    let username = req.query.username
    let password = req.query.password

    let usernameQueryString = `
        SELECT *
        FROM Login_Info
        WHERE username = '${username}'
    `
    connection.query(usernameQueryString, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ "successful" : false, "error" : error, "loggedInUser" : null })
        } else if (results) {
            if (results.length == 0) {
                res.json({ "successful" : false, "error" : "Username not found!", "loggedInUser" : null })
                return;
            }

            let credentialQueryString = `
                SELECT *
                FROM Login_Info
                WHERE username = '${username}' AND password = '${password}'
            `
            connection.query(credentialQueryString, function (error, results, fields) {
                if (error) {
                    console.log(error)
                    res.json({ "successful" : false, "error" : error, "loggedInUser" : null })
                } else if (results) {
                    if (results.length > 0) {
                        res.json({ "successful" : true, "loggedInUser" : username })
                    } else {
                        res.json({ "successful" : false, "error" : "Incorrect password!", "loggedInUser" : null })
                    }
                }
            });
        }
    });
}

// Checks whether or not the given user has favorited the given song or not
async function check_song_is_favorite(req, res) {
    let username = req.query.username
    let song_id = req.query.song_id

    let queryString = `
        SELECT *
        FROM User_Favorites
        WHERE username = '${username}' AND song_id = '${song_id}'
    ` 
    connection.query(queryString, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ "successful" : false, "error" : error, "isFavorite": false })
        } else if (results) {
            if (results.length > 0) {
                res.json({ "successful" : true, "isFavorite": true })
            } else {
                res.json({ "successful" : true, "isFavorite": false })
            }
        }
    });
}

// Gets all the favorite songs of the logged in user
async function get_favorite_songs(req, res) {
    let username = req.query.username
    let limit = req.query.limit ? req.query.limit : 100
    let page = req.query.page

    let queryString = `
        WITH Favorite_Songs AS (
            SELECT song_id
            FROM User_Favorites
            WHERE username = '${username}'
        ), 
        limited_songs AS (
            SELECT S.id, S.name, S.year, A.name AS artist_name, A.id AS artist_id
            FROM Favorite_Songs F
                JOIN Songs S
                    ON F.song_id = S.id
                JOIN Song_Artists SA
                    ON S.id = SA.song_id
                JOIN Artists A
                    ON A.id = SA.artist_id
        LIMIT ${limit})
        SELECT id, name, year, artist_id, MAX(artist_name) AS artist_name
        FROM limited_songs
        GROUP BY id, name, year
    `

    if (page && !isNaN(page)) {
        connection.query(queryString, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ "error" : error })
            } else if (results) {
                let pagesize = req.query.pagesize ? req.query.pagesize : 10
                let returnedResults = [];
                let start = (parseInt(pagesize) - 1) * parseInt(pagesize);

                for (let i = start; i < start + parseInt(pagesize); i++) {
                    returnedResults.push(results[i]);
                }
                res.json({ results: returnedResults })
            }
        });
    } else {
        connection.query(queryString, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ "error" : error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// Toggles the favorited status of the given song for the logged in user
async function toggle_favorite_song(req, res) {
    if (req.query.is_favorite === undefined || req.query.username === undefined || req.query.song_id === undefined) {
        res.json({ "successful" : false, "error" : "required parameter not defined"})
        return
    }
    let is_favorite = req.query.is_favorite === "true"
    let username = req.query.username
    let song_id = req.query.song_id

    if (is_favorite) {
        // If the song is already a favorite, try to delete it
        let deletionQueryString = `
            DELETE FROM User_Favorites
            WHERE username='${username}' AND song_id='${song_id}'
        `
        connection.query(deletionQueryString, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ "successful" : false, "error" : error})
            } else if (results.affectedRows > 0) {
                res.json({ "successful" : true, "nowIsFavorite" : false })
            } else {
                res.json({ "successful" : false, "error" : "Deletion failed", "nowIsFavorite" : true })
            }
        });
    } else {
        // If the song is not yet a favorite, try to add it
        let insertionQueryString = `
            INSERT INTO User_Favorites(username, song_id)
            VALUES ('${username}', '${song_id}')
        `
        connection.query(insertionQueryString, function (error, results, fields) {
            if (error) {
                console.log(error)
                if (results.code == "ER_DUP_ENTRY") {
                    res.json({ "successful" : true, "nowIsFavorite" : true })
                }
                res.json({ "successful" : false, "error" : error})
            } else if (results.affectedRows > 0) {
                res.json({ "successful" : true, "nowIsFavorite" : true })
            } else {
                res.json({ "successful" : true, "error" : "Insertion failed", "nowIsFavorite" : false })
            }
        });
    }
}

module.exports = {
    song,
    song_artists,
    artist_songs,
    artist_search,
    song_charts,
    album,
    album_search,
    album_artists,
    search_chart,
    song_matching_attr,
    search,
    similar,
    album_similar,
    artist_connections,
    leaderboard,
    register,
    login,
    check_song_is_favorite,
    get_favorite_songs,
    toggle_favorite_song
}
