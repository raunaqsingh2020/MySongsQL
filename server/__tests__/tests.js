const { expect } = require("@jest/globals");
const supertest = require("supertest");
const { number } = require("yargs");
const results = require("./results.json");
const app = require('../server');

// Turn off console messages
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(jest.fn());
});

jest.setTimeout(20000)

// **********************************
//         /search Route
// **********************************

test("GET /search by artist", async () => {
  await supertest(app).get("/search?artist=Simon Whistler")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.sort()).toEqual(results.search_artist.sort())
    });
});

test("GET /search custom page default pagesize", async () => {
  await supertest(app).get("/search?artist=Shawn Mendes&page=2")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(10)
    });
});

test("GET /search custom page pagesize", async () => {
  await supertest(app).get("/search?artist=Shawn Mendes&page=2&pagesize=2")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(2)
      for (song of response.body.results) {
        expect(song).toEqual(expect.anything())
      }
    });
});

test("GET /search page NaN", async () => {
  await supertest(app).get("/search?artist=Taylor Swift&page=a")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(3)
      for (song of response.body.results) {
        expect(song).toEqual(expect.anything())
      }
    });
});

test("GET /search page invalid", async () => {
  await supertest(app).get("/search?artist=Taylor Swift&page=2&pagesize=10")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(10)
      for (song of response.body.results) {
        expect(song).toBeNull()
      }
    });
});

test("GET /search song", async () => {
  await supertest(app).get("/search?song=Symphony&page=3")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(10)
      for (song of response.body.results) {
        expect(song).toEqual(expect.anything())
      }
    });
});

// **********************************
//         /song Route
// **********************************

test("GET /song by id", async () => {
  await supertest(app).get("/song?id=07qwBpelD9IfX41LPt55M0")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual(results.song_id)
    });
});

test("GET /song by id invalid", async () => {
  await supertest(app).get("/song?id=abc")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual(results.song_id_invalid)
    });
});

test("GET /song error", async () => {
  await supertest(app).get("/song?id='")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body).toHaveProperty("error")
    });
});

// **********************************
//         /song_artists Route
// **********************************

test("GET /song_artists by id 1 artist", async () => {
  await supertest(app).get("/song_artists?id=0001Wtl60puR26ZtSDIF66")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual(results.song_artists_id1)
    });
});

test("GET /song_artists by id 2 artists", async () => {
  await supertest(app).get("/song_artists?id=0001Lyv0YTjkZSqzT4WkLy")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual(results.song_artists_id2)
    });
});

test("GET /song_artists by id 3 artists", async () => {
  await supertest(app).get("/song_artists?id=07qwBpelD9IfX41LPt55M0")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual(results.song_artists_id3)
    });
});

test("GET /song_artists by id invalid", async () => {
  await supertest(app).get("/song_artists?id=abc")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual("")
    });
});

test("GET /song_artists error", async () => {
  await supertest(app).get("/song_artists?id='")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body).toHaveProperty("error")
    });
});

// **********************************
//         /artist_songs Route
// **********************************

test("GET /artist_songs by id", async () => {
  await supertest(app).get("/artist_songs?id=06HL4z0CvFAxyc27GXpf02")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual(results.artist_songs)
    });
});

test("GET /artist_songs page", async () => {
  await supertest(app).get("/artist_songs?id=06HL4z0CvFAxyc27GXpf02&page=1&pagesize=2")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(2)
      for (song of response.body.results) {
        expect(song).toEqual(expect.anything())
      }
    });
});

test("GET /artist_songs by id invalid", async () => {
  await supertest(app).get("/artist_songs?id=abc")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual([])
    });
});

test("GET /artist_songs error", async () => {
  await supertest(app).get("/artist_songs?id='")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body).toHaveProperty("error")
    });
});

test("GET /artist_songs error 2", async () => {
  await supertest(app).get("/artist_songs?id='&page=1")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body).toHaveProperty("error")
    });
});

// **********************************
//         /artist_search Route
// **********************************

test("GET /artist_search by artist", async () => {
  await supertest(app).get("/artist_search?name=John Lennon")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.sort()).toEqual(results.artist_search.sort())
    });
});

test("GET /artist_search custom page", async () => {
  await supertest(app).get("/artist_search?name=John&page=2&pagesize=2")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(2)
      for (song of response.body.results) {
        expect(song).toEqual(expect.anything())
      }
    });
});

test("GET /artist_search page invalid", async () => {
  await supertest(app).get("/artist_search?name=Taylor Swift&page=5&pagesize=10")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(10)
      for (song of response.body.results) {
        expect(song).toBeNull()
      }
    });
});

test("GET /artist_search special character", async () => {
  await supertest(app).get("/artist_search?name='&limit=10")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(10)
      for (song of response.body.results) {
        expect(song).toEqual(expect.anything())
      }
    });
});

test("GET /artist_search special character 2", async () => {
  await supertest(app).get("/artist_search?name='&page=1")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(10)
      for (song of response.body.results) {
        expect(song).toEqual(expect.anything())
      }
    });
});

// **********************************
//         /song_charts Route
// **********************************

test("GET /song_charts by id", async () => {
  await supertest(app).get("/song_charts?id=08bNPGLD8AhKpnnERrAc6G")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual(results.song_charts_id)
    });
});

test("GET /song_charts by id invalid", async () => {
  await supertest(app).get("/song_charts?id=abc")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual([])
    });
});

test("GET /song_charts error", async () => {
  await supertest(app).get("/song_charts?id='")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body).toHaveProperty("error")
    });
});

// **********************************
//         /similar Route
// **********************************

test("GET /similar by id", async () => {
  await supertest(app).get("/similar?id=08bNPGLD8AhKpnnERrAc6G")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(10)
      for (entry of response.body.results) {
        expect(entry).toEqual(expect.anything())
      }
    });
});

test("GET /similar by id invalid", async () => {
  await supertest(app).get("/similar?id=abc")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body).toHaveProperty("error")
    });
});

test("GET /similar error", async () => {
  jest.setTimeout(40000)
  await supertest(app).get("/similar?id='")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body).toHaveProperty("error")
    });
});

// **********************************
//         /album_search Route
// **********************************

test("GET /album_search by name", async () => {
  await supertest(app).get("/album_search?name=ISOHPET")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.sort()).toEqual(results.album_search.sort())
    });
});

test("GET /album_search custom page", async () => {
  await supertest(app).get("/album_search?name=Vivaldi&page=2&pagesize=2")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(2)
      for (song of response.body.results) {
        expect(song).toEqual(expect.anything())
      }
    });
});

test("GET /album_search special character", async () => {
  await supertest(app).get("/album_search?name='&limit=10")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(10)
      for (song of response.body.results) {
        expect(song).toEqual(expect.anything())
      }
    });
});

test("GET /album_search special character 2", async () => {
  await supertest(app).get("/album_search?name='&page=1")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(10)
      for (song of response.body.results) {
        expect(song).toEqual(expect.anything())
      }
    });
});

// **********************************
//         /album Route
// **********************************

test("GET /album by id", async () => {
  await supertest(app).get("/album?id=00abtcfjeGNM4ua8cyf2ii")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.sort()).toEqual(results.album.sort())
    });
});

test("GET /album by id invalid", async () => {
  await supertest(app).get("/album?id=abc")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual([])
    });
});

test("GET /album error", async () => {
  await supertest(app).get("/album?id='")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body).toHaveProperty("error")
    });
});

// **********************************
//         /album_artists Route
// **********************************

test("GET /album_artists by id 1 artist", async () => {
  await supertest(app).get("/album_artists?id=78Wo2dtdwGWdBXhesG7FRj")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual(results.album_artists_id1)
    });
});

test("GET /album_artists by id 2 artists", async () => {
  await supertest(app).get("/album_artists?id=3nQbcYEXJ3QQkkObxmm76Y")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual(results.album_artists_id2)
    });
});

test("GET /album_artists by id 3 artists", async () => {
  await supertest(app).get("/album_artists?id=0kkr0V6PLK2tIhrmtnhajx")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual(results.album_artists_id3)
    });
});

test("GET /album_artists by id invalid", async () => {
  await supertest(app).get("/album_artists?id=abc")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual("")
    });
});

test("GET /album_artists error", async () => {
  await supertest(app).get("/album_artists?id='")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body).toHaveProperty("error")
    });
});

// **********************************
//         /album_similar Route
// **********************************

test("GET /album_similar by id", async () => {
  await supertest(app).get("/album_similar?id=004feUXS0gZkJrVpjRRFKW")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(10)
      for (entry of response.body.results) {
        expect(entry).toEqual(expect.anything())
      }
    });
});

test("GET /album_similar by id invalid", async () => {
  await supertest(app).get("/album_similar?id=abc")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(0)
    });
});

test("GET /album_similar error", async () => {
  await supertest(app).get("/album_similar?id='")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body).toHaveProperty("error")
    });
});

// **********************************
//         /artist_connections Route
// **********************************

test("GET /artist_connections by id", async () => {
  await supertest(app).get("/artist_connections?id=06HL4z0CvFAxyc27GXpf02")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.sort()).toEqual(results.artist_connections.sort())
    });
});

test("GET /artist_connections by id invalid", async () => {
  await supertest(app).get("/artist_connections?id=abc")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual([{"name": "No Connections"}])
    });
});

test("GET /artist_connections error", async () => {
  await supertest(app).get("/artist_connections?id='")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body).toHaveProperty("error")
    });
});

// **********************************
//         /leaderboard Route
// **********************************

test("GET /leaderboard", async () => {
  await supertest(app).get("/leaderboard")
    .expect(200)
    .then((response) => {
      // Check text 
      for (entry of response.body.results) {
        expect(entry).toEqual(expect.anything())
      }
    });
});

// **********************************
//         /search_chart Route
// **********************************

test("GET /search_chart no params", async () => {
  await supertest(app).get("/search_chart")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(17568)
      for (entry of response.body.results) {
        expect(entry).toEqual(expect.anything())
      }
    });
});

test("GET /search_chart by chart", async () => {
  await supertest(app).get("/search_chart?date=2018-03-01&chart=top200")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(1730)
      for (entry of response.body.results) {
        expect(entry).toEqual(expect.anything())
      }
    });
});

test("GET /search_chart by date", async () => {
  await supertest(app).get("/search_chart?date=2017-01-01")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results.length).toEqual(1312)
      for (entry of response.body.results) {
        expect(entry).toEqual(expect.anything())
      }
    });
});

test("GET /search_chart by chart invalid", async () => {
  await supertest(app).get("/search_chart?chart=abc")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual([])
    });
});

test("GET /search_chart by date invalid", async () => {
  await supertest(app).get("/search_chart?date=1000-01-01")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual([])
    });
});

test("GET /search_chart error", async () => {
  await supertest(app).get("/search_chart?date='")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body).toHaveProperty("error")
    });
});

// **********************************
//    /song_matching_attr Route
// **********************************

test("GET /song_matching_attr no params", async () => {
  await supertest(app).get("/song_matching_attr")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body.results).toEqual([{"name": "No Similar Songs"}])
    });
});

test("GET /song_matching_attr default", async () => {
  await supertest(app).get("/song_matching_attr?id=0007ViJ9W2YqgQX7zDic82")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(7)
      for (entry of response.body.results) {
        expect(entry).toEqual(expect.anything())
      }
    });
});

test("GET /song_matching_attr by energy attribute", async () => {
  await supertest(app).get("/song_matching_attr?id=0007ViJ9W2YqgQX7zDic82&attr=energy")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(5)
      for (entry of response.body.results) {
        expect(entry).toEqual(expect.anything())
      }
    });
});

test("GET /song_matching_attr invalid attribute", async () => {
  await supertest(app).get("/song_matching_attr?attr=asdf'")
    .expect(200)
    .then((response) => {
      // Check text 
      expect(response.body).toHaveProperty("error")
    });
});

// **********************************
//    Login/Account Related Routes
// **********************************
test("POST /register account already exists", async () => {
  await supertest(app).post("/register?username=test&password=test")
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual({"successful" : false, "error" : "Username already exists!", "loggedInUser" : null})
    });
});

test("POST /login incorrect username", async () => {
  await supertest(app).post("/login?username=sdfasdf")
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual({ "successful" : false, "error" : "Username not found!", "loggedInUser" : null })
    });
});

test("POST /login incorrect password", async () => {
  await supertest(app).post("/login?username=test&password=asdf")
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual({ "successful" : false, "error" : "Incorrect password!", "loggedInUser" : null })
    });
});

test("POST /login correct", async () => {
  await supertest(app).post("/login?username=test&password=test")
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual({ "successful" : true, "loggedInUser" : "test" })
    });
});

test("GET /check_song_is_favorite false", async () => {
  await supertest(app).get("/check_song_is_favorite?username=test&song_id=0007ViJ9W2YqgQX7zDic82")
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual({ "successful" : true, "isFavorite": false })
    });
});

test("POST /toggle_favorite_song failure", async () => {
  await supertest(app).post("/toggle_favorite_song?is_favorite=true&song_id=0007ViJ9W2YqgQX7zDic82")
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual({ "successful" : false, "error" : "required parameter not defined"})
    });
});

test("POST /toggle_favorite_song change song to favorite", async () => {
  await supertest(app).post("/toggle_favorite_song?is_favorite=false&username=test&song_id=0007ViJ9W2YqgQX7zDic82")
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual({ "successful" : true, "nowIsFavorite" : true })
    });
});

test("GET /get_favorite_songs returns the single song", async () => {
  await supertest(app).get("/get_favorite_songs?username=test")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(1)
    });
});

test("GET /check_song_is_favorite true", async () => {
  await supertest(app).get("/check_song_is_favorite?username=test&song_id=0007ViJ9W2YqgQX7zDic82")
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual({ "successful" : true, "isFavorite": true })
    });
});

test("POST /toggle_favorite_song unfavorite song failure", async () => {
  await supertest(app).post("/toggle_favorite_song?is_favorite=true&username=test&song_id=asdf")
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual({ "successful" : false, "error" : "Deletion failed", "nowIsFavorite" : true })
    });
});

test("POST /toggle_favorite_song unfavorite song", async () => {
  await supertest(app).post("/toggle_favorite_song?is_favorite=true&username=test&song_id=0007ViJ9W2YqgQX7zDic82")
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual({ "successful" : true, "nowIsFavorite" : false })
    });
});

test("GET /check_song_is_favorite changed back to false", async () => {
  await supertest(app).get("/check_song_is_favorite?username=test&song_id=0007ViJ9W2YqgQX7zDic82")
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual({ "successful" : true, "isFavorite": false })
    });
});
