// Fetcher used to communicate with the backend server, executing backend routes and returning the results to the frontend client
import config from './config.json'

// Gets all of the songs in the databse, limited by limit
const getAllSongs = async (limit, page, pagesize) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/search?limit=${limit}&page=${page}&pagesize=${pagesize}`, {
      method: 'GET',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/search?limit=${limit}&page=${page}&pagesize=${pagesize}`, {
      method: 'GET',
    });
  }
  return res.json()
}

// Gets all of the albums in the database, limited by limit
const getAllAlbums = async (limit, page, pagesize) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/album_search?limit=${limit}&page=${page}&pagesize=${pagesize}`, {
      method: 'GET',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/album_search?limit=${limit}&page=${page}&pagesize=${pagesize}`, {
      method: 'GET',
    })
  }
  return res.json()
}

// Gets the song with the specified id and all of its associated numerical attributes
const getSong = async (id) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/song?id=${id}`, {
      method: 'GET',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/song?id=${id}`, {
      method: 'GET',
    })
  }
  return res.json()
}

// Gets a string containing all of the artists of the song with the given id
const getSongArtists = async (id) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/song_artists?id=${id}`, {
      method: 'GET',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/song_artists?id=${id}`, {
      method: 'GET',
    })
  }
  return res.json()
}

// Searches for songs in the databse based on the name of the song and/or the name of the artist
const getSongSearch = async (name, artist, limit, page, pagesize) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/search?name=${name}&artist=${artist}&page=${page}&pagesize=${pagesize}&limit=${limit}`, {
      method: 'GET',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/search?name=${name}&artist=${artist}&page=${page}&pagesize=${pagesize}&limit=${limit}`, {
      method: 'GET',
    })
  }
  return res.json()
}

// Gets the top 10 most similar songs to the song with the provided id
const getSimilarSongs = async (id, limit) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/similar?id=${id}&limit=${limit}`, {
      method: 'GET',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/similar?id=${id}&limit=${limit}`, {
      method: 'GET',
    })
  }
  return res.json()
}

// Gets the top 10 most similar songs to the song with the provided id, based on the provided attribute
const getAttributeSongs = async (id, attr, limit) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/song_matching_attr?id=${id}&attr=${attr}&limit=${limit}`, {
      method: 'GET',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/song_matching_attr?id=${id}&attr=${attr}&limit=${limit}`, {
      method: 'GET',
    })
  }
  return res.json()
}

// Gets all songs in the album with the provided id
const getAlbum = async (id) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/album?id=${id}`, {
      method: 'GET',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/album?id=${id}`, {
      method: 'GET',
    })
  }
  return res.json()
}

// Gets a string containing all of the artists of the album with the given id
const getAlbumArtists = async (id) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/album_artists?id=${id}`, {
      method: 'GET',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/album_artists?id=${id}`, {
      method: 'GET',
    })
  }
  return res.json()
}

// Searches for albums with the provided name
const getAlbumSearch = async (name, limit, page, pagesize) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/album_search?name=${name}&page=${page}&pagesize=${pagesize}&limit=${limit}`, {
      method: 'GET',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/album_search?name=${name}&page=${page}&pagesize=${pagesize}&limit=${limit}`, {
      method: 'GET',
    })
  }
  return res.json()
}

// Gets the top 10 most similar albums to the album with the provided id
const getSimilarAlbums = async (id, limit) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/album_similar?id=${id}&limit=${limit}`, {
      method: 'GET',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/album_similar?id=${id}&limit=${limit}`, {
      method: 'GET',
    })
  }
  return res.json()
}

// Gets all songs by the artist with the provided id
const getArtistSongs = async (id, limit, page, pagesize) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/artist_songs?id=${id}&page=${page}&pagesize=${pagesize}&limit=${limit}`, {
      method: 'GET',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/artist_songs?id=${id}&page=${page}&pagesize=${pagesize}&limit=${limit}`, {
      method: 'GET',
    })
  }
  return res.json()
}

// Searches for artists based on the provided name
const artistSearch = async (name, limit, page, pagesize) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/artist_search?name=${name}&page=${page}&pagesize=${pagesize}&limit=${limit}`, {
      method: 'GET',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/artist_search?name=${name}&page=${page}&pagesize=${pagesize}&limit=${limit}`, {
      method: 'GET',
    })
  }
  return res.json()
}

// Gets the 1, 2, and 3 connections to the artist with the provided id, as defined in Homework 1
const artistConnections = async (id, limit, page, pagesize) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/artist_connections?id=${id}&page=${page}&pagesize=${pagesize}&limit=${limit}`, {
      method: 'GET',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/artist_connections?id=${id}&page=${page}&pagesize=${pagesize}&limit=${limit}`, {
      method: 'GET',
    })
  }
  return res.json()
}

// Gets a leaderboard of artists who were at the top of the charts for the longest
const leaderboard = async () => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/leaderboard`, {
      method: 'GET',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/leaderboard`, {
      method: 'GET',
    })
  }
  return res.json()
}

// Searches for the chart data on the given date and chart in the given region
const searchChart = async (date, chart, region) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/search_chart?date=${date}&chart=${chart}&region=${region}`, {
      method: 'GET',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/search_chart?date=${date}&chart=${chart}&region=${region}`, {
      method: 'GET',
    })
  }
  return res.json()
}

// Gets whether or not the user with the given username favorited the song with the given id
const getSongIsFavorite = async (username, song_id) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/check_song_is_favorite?username=${username}&song_id=${song_id}`, {
      method: 'GET',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/check_song_is_favorite?username=${username}&song_id=${song_id}`, {
      method: 'GET',
    })
  }
  return res.json()
}

// Gets all of the favorite songs of the user with the given username
const getFavoriteSongs = async (username, limit, page, pagesize) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/get_favorite_songs?username=${username}&page=${page}&pagesize=${pagesize}&limit=${limit}`, {
      method: 'GET',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/get_favorite_songs?username=${username}&page=${page}&pagesize=${pagesize}&limit=${limit}`, {
      method: 'GET',
    })
  }
  return res.json()
}

// Logs the user with the provided username into the application
const postLogin = async (username, password) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/login?username=${username}&password=${password}`, {
      method: 'POST',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/login?username=${username}&password=${password}`, {
      method: 'POST',
    })
  }
  return res.json()
}

// Registers the user with the provided username, logging them in at the same time
const postRegister = async (username, password) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/register?username=${username}&password=${password}`, {
      method: 'POST',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/register?username=${username}&password=${password}`, {
      method: 'POST',
    })
  }
  return res.json()
}

// Toggles the status of the given song for the given, favoriting or unfavoriting the song
const postToggleFavoriteSong = async (is_favorite, username, song_id) => {
  let res;
  if (config.prod) {
    res = await fetch(`${config.server_prefix}://${config.server_host}/toggle_favorite_song?is_favorite=${is_favorite}&username=${username}&song_id=${song_id}`, {
      method: 'POST',
    })
  } else {
    res = await fetch(`${config.server_prefix}://${config.server_host}:${config.server_port}/toggle_favorite_song?is_favorite=${is_favorite}&username=${username}&song_id=${song_id}`, {
      method: 'POST',
    })
  }
  return res.json()
}

export {
    getAllSongs,
    getAllAlbums,
    getSong,
    getSongArtists,
    getSongSearch,
    getSimilarSongs,
    getAttributeSongs,
    getAlbum,
    getAlbumArtists,
    getAlbumSearch,
    getSimilarAlbums,
    getArtistSongs,
    artistSearch,
    artistConnections,
    leaderboard,
    searchChart,
    getSongIsFavorite,
    getFavoriteSongs,
    postLogin,
    postRegister,
    postToggleFavoriteSong
}
