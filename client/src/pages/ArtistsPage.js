// Page used to display artists, perform artist search, display all songs by an artist, and display connected artists
import React from 'react';
import { Button, Card, CardBody, CardImg } from "shards-react";


import {
    Table,
    Row,
    Select
} from 'antd'

import { getArtistSongs, artistSearch, artistConnections } from '../fetcher'


import MenuBar from '../components/MenuBar';
const { Option } = Select;

// Defines the columns of the table of songs by an artist
const songColumns = [
    {
        title: 'Song Title',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, row) => <a href={`/songs?id=${row.id}`}>{text}</a>
    },
    {
      title: 'Artist',
      dataIndex: 'artist_name',
      key: 'artist_name',
      sorter: (a, b) => a.artist_name.localeCompare(b.artist_name)
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      sorter: (a, b) => a.year - b.year
    }
];

// Defines the columns of the main table of artists
const artistColumns = [
    {
      title: 'Artist Name',
      dataIndex: 'artist_name',
      key: 'artist_name',
      sorter: (a, b) => a.artist_name.localeCompare(b.artist_name),
      render: (text, row) => <a href={`/artists?id=${row.id}&name=${row.artist_name}`}>{text}</a>
    }
];

// Defines the columns of the table of connected artists
const similarityColumns = [
    {
      title: 'Artist Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, row) => row.id ? <a href={`/artists?id=${row.id}&name=${row.name}`}>{text}</a> : text
    },
    {
        title: 'Collaboration Distance',
        dataIndex: 'N',
        key: 'N',
        sorter: (a, b) => a.N - b.N
      }
];
class ArtistsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            songsResults: [],
            artistsResults: [],
            artistConnections: [],
            nameQuery: "",
            selectedArtistId: window.location.search ? window.location.search.substring(1).split('=')[1] : 0,
            selectedArtistName: window.location.search ? decodeURIComponent(window.location.search.substring(1).split('=')[2]) : 0,
            selectedArtistSearchResults: [],
            limit: 100,
            searchLimit: 100,
            connectionsLimit: 100,
            loadingArtists: false,
            loadingSongs: false,
            loadingConnections: false,
        }
        
        this.handleNameQueryChange = this.handleNameQueryChange.bind(this)
        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.onSongLimitChange = this.onSongLimitChange.bind(this)
        this.onSearchLimitChange = this.onSearchLimitChange.bind(this)
        this.onConnectionsLimitChange = this.onSearchLimitChange.bind(this)
        this.searchBing = this.searchBing.bind(this)
    }

    // Updates nameQuery state every time the user types something new in the search box
    handleNameQueryChange(event) {
        this.setState({ nameQuery: event.target.value })
    }

    // Called whenever the search button is pressed, refreshes the results in the main artists table based on the name query
    updateSearchResults() {
        this.setState({ loadingArtists: true })
        artistSearch(this.state.nameQuery, 100, null, null).then(res => {
            this.setState({ artistsResults: res.results })
            this.setState({ loadingArtists: false })
        })
    }

    // Called whenever the limit on the table with songs by the artist is changed, refreshes to change the number of results displayed
    onSongLimitChange(value) {
        this.setState({ loadingSongs: true })
        getArtistSongs(this.state.selectedArtistId, value, null, null).then(res => {
          this.setState({limit: value})
          this.setState({ songsResults: res.results })
          this.setState({ loadingSongs: false })
        })
    }

    // Called whenever the limit on the main table of artists is changed, refreshes to change the number of results displayed
    onSearchLimitChange(value) {
        this.setState({ loadingArtists: true })
        artistSearch(this.state.nameQuery, value, null, null).then(res => {
            this.setState({ searchLimit: value})
            this.setState({ artistsResults: res.results })
            this.setState({ loadingArtists: false })
        })
    }

    // Called whenever the limit on the table of artist connections is changed, refreshes to change the number of results displayed
    onConnectionsLimitChange(value) {
        this.setState({ loadingConnections: true })
        artistConnections(this.state.selectedArtistId, value, null, null).then(res => {
            this.setState({ connectionsLimit: value})
            this.setState({ artistConnections: res.results })
            this.setState({ loadingConnections: false })
        })
    }

    // Performs the API call to the Bing API, searching for the artist's name and returning the search results
    searchBing(artist_name) {
        return new Promise(function (resolve, reject) {
            let request = new XMLHttpRequest();
            let queryString = "https://api.bing.microsoft.com/v7.0/news/search?q=" + artist_name + "&count=100";
        
            request.open("GET", queryString);
            request.setRequestHeader("Ocp-Apim-Subscription-Key", "c93d423fd4e641528d77dcc156a3e24e");
            request.setRequestHeader("Accept", "application/json");
            request.send();

            request.onload = function() {
                let responseJSON = JSON.parse(this.responseText);
                console.log(queryString)
                console.log(responseJSON)

                var displayTokens = []
                for (var i=0; i<responseJSON.value.length; i++) {
                    var newsItem = responseJSON.value[i]
                    if ((typeof newsItem.image !== "undefined")) {
                        displayTokens.push({ "name" : newsItem.name, "url" : newsItem.url, "image": newsItem.image.thumbnail.contentUrl })
                    }
                }
                
                resolve(displayTokens)
            }
        })
    }

    componentDidMount() {
        // Causes an initial visual loading state, changed whenever the query completes
        this.setState({ loadingArtists: true })
        this.setState({ loadingSongs: true })
        this.setState({ loadingConnections: true })

        // Gets all the songs by the artist with the provided id
        getArtistSongs(this.state.selectedArtistId, 100, null, null).then(res => {
            this.setState({ songsResults: res.results })
            this.setState({ loadingSongs: false })
        })

        // Gets all the artists that match the provided name query
        artistSearch(this.state.nameQuery, 100, null, null).then(res => {
            this.setState({ artistsResults: res.results })
            this.setState({ loadingArtists: false })
        })

        // Gets all the 1, 2, and 3 connections of the provided artist, as defined in Homework 1
        artistConnections(this.state.selectedArtistId, 100, null, null).then(res => {
            this.setState({ artistConnections: res.results })
            this.setState({ loadingConnections: false })
        })

        // Performs the Bing search for the artist's name and gets the results
        if (this.state.selectedArtistId) {
            var elem = document.getElementById("artist-div");
            const y = elem.getBoundingClientRect().top + window.pageYOffset - 100;
            window.scrollTo({top: y, behavior: 'smooth'});
            this.searchBing(this.state.selectedArtistName).then((displayTokens, error) => {
                this.setState({ selectedArtistSearchResults: displayTokens.slice(0, 8) })
            })
        }
    }

    render() {
        return (
            <div style={{ paddingBottom: 50 }}>
                <MenuBar />
                {/* Input field and search button that handles searching for an artist */}
                <div style={{ width: '100vw', margin: '0 0', marginTop: '5vh', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ padding: 0, margin: 0, }}>
                        <h6 style={{ margin: 0, fontWeight: 600 }}>Artist Search:</h6>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: '20px 0 0 0', height: '50px' }}>
                            <input style={{ 
                                width: 'max(150px, 20vw)', height: '50px', borderRadius: '1000px', borderWidth: 0, padding: 13, margin: '0px 20px 20px 0', boxShadow: '0px 0px 15px #00000020',
                            }} placeholder="Artist Name" value={this.state.nameQuery} onChange={this.handleNameQueryChange} />
                            <Button pill theme="dark" onClick={this.updateSearchResults}>Search</Button>
                        </div>
                    </div>
                </div>
                {/* Displays the artists that result from the artist search */}
                <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
                    <Select defaultValue="100" style={{ width: 120 }} onChange={this.onSearchLimitChange}>
                        <Option value="100">100</Option>
                        <Option value="200">200</Option>
                        <Option value="300">300</Option>
                        <Option value="400">400</Option>
                        <Option value="500">500</Option>
                    </Select>
                    <Table loading={this.state.loadingArtists} dataSource={this.state.artistsResults} columns={artistColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </div>
                {/* Displays all of the songs by the artist with the provided id */}
                {this.state.selectedArtistName ?
                    <>
                        <center>
                            <div id="artist-div" style={{ width: 'min(300px, 50%)', height: 5, backgroundColor: '#E37575', borderRadius: 1000, borderWidth: 0, margin: '40px 0 30px 0' }}/>
                        </center>
                        <center>
                            <h3 style={{ margin: 0, fontWeight: 600, marginBottom: 10 }}>{this.state.selectedArtistName}</h3>
                        </center>
                    </>
                : null}
                {this.state.selectedArtistName ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
                    <h3>Songs</h3>
                    <Select defaultValue="100" style={{ width: 120 }} onChange={this.onSongLimitChange}>
                        <Option value="100">100</Option>
                        <Option value="200">200</Option>
                        <Option value="300">300</Option>
                        <Option value="400">400</Option>
                        <Option value="500">500</Option>
                    </Select>
                    <Table loading={this.state.loadingSongs} dataSource={this.state.songsResults} columns={songColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </div> : null}
                {/* Displays the 1, 2, and 3 connections to the artist with the provided id */}
                {this.state.selectedArtistName ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
                    <h3>Artists Connections</h3>
                    <Select defaultValue="100" style={{ width: 120 }} onChange={this.onConnectionsLimitChange}>
                        <Option value="100">100</Option>
                        <Option value="200">200</Option>
                        <Option value="300">300</Option>
                        <Option value="400">400</Option>
                        <Option value="500">500</Option>
                    </Select>
                    <Table loading={this.state.loadingConnections} dataSource={this.state.artistConnections} columns={similarityColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </div> : null}
                {/* Displays the Bing search results for the name of the artist with the provided id */}
                {(this.state.selectedArtistName && this.state.selectedArtistSearchResults.length > 0)  ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
                    <h3>{this.state.selectedArtistName} in the News</h3>
                    <Row>
                    {this.state.selectedArtistSearchResults.map((item) => (
                      <a href={item.url} target="_blank" rel="noreferrer">
                        <Card style={{ maxWidth: "max(15.5vw, 150px)", margin: "1vw"}}>
                        <CardImg top src={item.image} />
                        <CardBody>
                          <p>{item.name}</p>
                        </CardBody>
                      </Card>
                      </a>
                    ))}
                    </Row>
                </div> : null}
            </div>
        )
    }
}

export default ArtistsPage