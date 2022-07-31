// Index used to route to the various pages of our application
import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import SongsPage from './pages/SongsPage';
import AlbumsPage from './pages/AlbumsPage';
import ArtistsPage from './pages/ArtistsPage';
import ChartsPage from './pages/ChartsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import FavoritesPage from './pages/FavoritesPage'
import 'antd/dist/antd.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

import "./styles/base.css"

// Defines the base routes to the various pages of our application
ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route exact
							path="/"
							render={() => (
								<HomePage />
							)}/>
        <Route exact
							path="/songs"
							render={() => (
								<SongsPage />
							)}/>
        <Route exact
							path="/albums"
							render={() => (
								<AlbumsPage />
							)}/>
		    <Route exact
							path="/artists"
							render={() => (
								<ArtistsPage />
							)}/>
		    <Route exact
							path="/charts"
							render={() => (
								<ChartsPage />
							)}/>
		    <Route exact
							path="/leaderboard"
							render={() => (
								<LeaderboardPage />
							)}/>
		    <Route exact
							path="/favorites"
							render={() => (
								<FavoritesPage />
							)}/>
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);

