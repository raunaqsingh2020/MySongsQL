// Page used to display albums, perform album search, display all songs in an album, and display similar albums
import React from 'react';
import { Button } from "shards-react";


import {
    Table,
    Select
} from 'antd'

import { getAlbumSearch, getAlbum, getAlbumArtists, getSimilarAlbums } from '../fetcher'


import MenuBar from '../components/MenuBar';
const { Option } = Select;

// Defines the columns of the main table of albums
const albumColumns = [
    {
      title: 'Title',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, row) => <a href={`/albums?id=${row.id}`}>{text}</a>
    }
];

// Defines the columns of the table containing all the songs in a given album
const songColumns = [
    {
        title: 'Song Titles',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, row) => <a href={`/songs?id=${row.id}`}>{text}</a>
    }
];

class AlbumsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nameQuery: "",
            albumsResults: [],
            selectedAlbumId: window.location.search ? window.location.search.substring(1).split('=')[1] : 0,
            selectedAlbumDetails: null,
            selectedAlbumArtists: null,
            selectedSimilarAlbums: null,
            limit: 100,
            loadingAlbums: false,
            loadingAlbum: false,
            loadingSimilar: false
        }

        this.handleNameQueryChange = this.handleNameQueryChange.bind(this)
        this.updateAlbumResults = this.updateAlbumResults.bind(this)
        this.onAlbumLimitChange = this.onAlbumLimitChange.bind(this)
    }

    // Updates nameQuery state every time the user types something new in the search box
    handleNameQueryChange(event) {
        this.setState({ nameQuery: event.target.value })
    }

    // Called whenever the search button is pressed, refreshes the results in the main albums table based on the name query
    updateAlbumResults() {
        this.setState({ loadingAlbums: true })
        getAlbumSearch(this.state.nameQuery, this.state.limit, null, null).then(res => {
            this.setState({ albumsResults: res.results })
            this.setState({ loadingAlbums: false })
        })
    }

    // Called whenever the limit on the main table of albums is changed, refreshes to change the number of results displayed
    onAlbumLimitChange(value) {
        this.setState({ loadingAlbums: true })
        getAlbumSearch(this.state.nameQuery, value, null, null).then(res => {
          this.setState({limit: value})
          this.setState({ albumsResults: res.results })
          this.setState({ loadingAlbums: false })
        })
    }

    componentDidMount() {
        // Causes an initial visual loading state, changed whenever the query completes
        this.setState({ loadingAlbums: true })
        this.setState({ loadingAlbum: true })
        this.setState({ loadingSimilar: true })

        // Gets the main table of albums at the top of the page, default limited to 100
        getAlbumSearch(this.state.nameQuery, 100, null, null).then(res => {
            this.setState({ albumsResults: res.results })
            this.setState({ loadingAlbums: false })
        })

        // Gets all songs in the album with the provided id
        getAlbum(this.state.selectedAlbumId).then(res => {
            if (this.state.selectedAlbumId) {
                this.setState({ selectedAlbumDetails: res.results})
                var elem = document.getElementById("album-div");
                const y = elem.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({top: y, behavior: 'smooth'});
            } else {
                this.setState({ selectedAlbumDetails: null})
            }
            this.setState({ loadingAlbum: false })
        })

        // Gets a string containing the names of all artists of the album with the provided id
        getAlbumArtists(this.state.selectedAlbumId).then(res => { 
            if (this.state.selectedAlbumId) {
                this.setState({ selectedAlbumArtists: res.results})
            } else {
                this.setState({ selectedAlbumArtists: null})
            }
        })

        // Gets the 10 most similar albums to the album with the provided id
        getSimilarAlbums(this.state.selectedAlbumId, 10).then(res => { 
            if (this.state.selectedAlbumId) {
                this.setState({ selectedSimilarAlbums: res.results})
            } else {
                this.setState({ selectedSimilarAlbums: null})
            }
            this.setState({ loadingSimilar: false })
        })
    }

    render() {
        return (
            <div style={{ paddingBottom: 50 }}>
                <MenuBar />
                {/* Input field and search button that handles searching for an album */}
                <div style={{ width: '100vw', margin: '0 0', marginTop: '5vh', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ padding: 0, margin: 0, }}>
                        <h6 style={{ margin: 0, fontWeight: 600 }}>Album Search:</h6>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: '20px 0 0 0', height: '50px' }}>
                            <input style={{ 
                                width: 'max(150px, 20vw)', height: '50px', borderRadius: '1000px', borderWidth: 0, padding: 13, margin: '0px 20px 20px 0', boxShadow: '0px 0px 15px #00000020',
                            }} placeholder="Album Name" value={this.state.nameQuery} onChange={this.handleNameQueryChange} />
                            <Button pill theme="dark" onClick={this.updateAlbumResults}>Search</Button>
                        </div>
                    </div>
                </div>
                {/* Displays the albums that result from the album search */}
                <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
                    <h3>Albums</h3>
                    <Select defaultValue="100" style={{ width: 120 }} onChange={this.onAlbumLimitChange}>
                        <Option value="100">100</Option>
                        <Option value="200">200</Option>
                        <Option value="300">300</Option>
                        <Option value="400">400</Option>
                        <Option value="500">500</Option>
                    </Select>
                    <Table loading={this.state.loadingAlbums} dataSource={this.state.albumsResults} columns={albumColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </div>
                {/* Displays all of the songs in the album with the provided id */}
                {this.state.selectedAlbumDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <center>
                        <div id="album-div" style={{ width: 'min(300px, 50%)', height: 5, backgroundColor: '#E37575', borderRadius: 1000, borderWidth: 0, margin: '40px 0 50px 0' }}/>
                    </center>
                    <center>
                        <h3 style={{ margin: 0, fontWeight: 600, marginBottom: 10 }}>{this.state.selectedAlbumDetails[0].album_name}</h3>
                        {this.state.selectedAlbumArtists ? 
                            <h5 style={{ margin: 0, fontWeight: 600 }}>{this.state.selectedAlbumArtists}</h5>
                        : null}
                    </center>
                    <Table loading={this.state.loadingAlbum} style={{ marginTop: '30px' }} dataSource={this.state.selectedAlbumDetails} columns={songColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </div> : null}
                {/* Displays the top 10 most similar albums to the album with the provided id */}
                {this.state.selectedAlbumId ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
                    <h3>Top 10 Similar Albums</h3>
                        <Table loading={this.state.loadingSimilar} dataSource={this.state.selectedSimilarAlbums} columns={albumColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </div> : null}
            </div>
        )
    }
}

export default AlbumsPage