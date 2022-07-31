USE sys;

CREATE DATABASE Spotify;
USE Spotify;

CREATE TABLE Artists
    (id varchar(255), name varchar(255),
PRIMARY KEY (id));

CREATE TABLE Albums
    (id varchar(255), name varchar(255),
PRIMARY KEY (id));

CREATE TABLE Songs
    (id varchar(255), name varchar(255), album_id varchar(255), track_number INT, disc_number INT,
     explicit BOOLEAN, danceability decimal(4,3), energy decimal(4,3), `key` INT, loudness decimal(6,3),
     mode tinyint(1), speechiness decimal(4,3), acousticness decimal(4,3), instrumentalness decimal(4,3),
     liveness decimal(4,3), valence decimal(4,3), tempo decimal(6,3), duration INT, time_signature INT,
     year INT, release_date DATE,
PRIMARY KEY (id),
FOREIGN KEY (album_id) REFERENCES Albums (id));

CREATE TABLE Charts
    (song_id varchar(255), `rank` INT, date DATE, region varchar(255), chart varchar(255), trend varchar(255), streams INT,
PRIMARY KEY (song_id, date, region, chart),
FOREIGN KEY (song_id) REFERENCES Songs (id));

CREATE TABLE Song_Artists
    (artist_id varchar(255), song_id varchar(255),
PRIMARY KEY (artist_id, song_id),
FOREIGN KEY (artist_id) REFERENCES Artists (id),
FOREIGN KEY (song_id) REFERENCES Songs (id));

