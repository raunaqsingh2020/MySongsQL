// Page used to the favorited songs of the logged in user
import React from 'react';
import { Button, Card, CardBody, Progress } from "shards-react";


import {
    Table,
    Row,
    Col,
    Select
} from 'antd'

import { getSong, getSongArtists, getSimilarSongs, getAttributeSongs, postToggleFavoriteSong, getSongIsFavorite, getFavoriteSongs } from '../fetcher'


import MenuBar from '../components/MenuBar';
const { Option } = Select;
// Defines the columns of the table of favorite songs
const songColumns = [
    {
      title: 'Song Title',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, row) => <a href={`/favorites?id=${row.id}`}>{text}</a>
    },
    {
      title: 'Artist Name',
      dataIndex: 'artist_name',
      key: 'artist_name',
      sorter: (a, b) => a.artist_name.localeCompare(b.artist_name),
      render: (text, row) => <a href={`/artists?id=${row.artist_id}&name=${row.artist_name}`}>{text}</a>
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      sorter: (a, b) => a.year - b.year
    }
  ];

// Defines the columns of the table of similar songs
const similarSongColumns = [
    {
      title: 'Song Title',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, row) => row.id ? <a href={`/favorites?id=${row.id}`}>{text}</a> : text
    },
    {
      title: 'Artist Name',
      dataIndex: 'artist_name',
      key: 'artist_name',
      sorter: (a, b) => a.artist_name.localeCompare(b.artist_name),
      render: (text, row) => <a href={`/artists?id=${row.artist_id}&name=${row.artist_name}`}>{text}</a>
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      sorter: (a, b) => a.year - b.year
    }
  ];

class SongsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            songsResults: [],
            selectedSongId: window.location.search ? window.location.search.substring(1).split('=')[1] : null,
            selectedSongDetails: null,
            selectedSongArtists: null,
            selectedIsFavorite: false,
            selectedSimilarSongs: null,
            selectedAttrSongs: null,
            limit: 100,
            similarLimit: 10,
            attrLimit: 10,
            selectedAttribute: 'danceability',
            isLoggedIn: (localStorage.getItem("isLoggedIn") === "true"),
            loggedInUser: localStorage.getItem("loggedInUser"),
            loadingSongs: false,
            loadingSimilar: false,
            loadingAttr: false
        }

        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.onSongLimitChange = this.onSongLimitChange.bind(this)
        this.onSimilarLimitChange = this.onSimilarLimitChange.bind(this)
        this.onAttrLimitChange = this.onAttrLimitChange.bind(this)
        this.onAttrChange = this.onAttrChange.bind(this)
        this.handleLoginChange = this.handleLoginChange.bind(this)
        this.toggleFavorite = this.toggleFavorite.bind(this)
    }

    updateSearchResults() {
        this.setState({ loadingSongs: true })
        getFavoriteSongs(this.loggedInUser, this.state.limit, null, null).then(res => {
            console.log(res.results)
            this.setState({ songsResults: res.results })
            this.setState({ loadingSongs: false })
        })
    }

    onSongLimitChange(value) {
        this.setState({ loadingSongs: true })
        getFavoriteSongs(this.loggedInUser, value, null, null).then(res => {
          this.setState({limit: value})
          this.setState({ songsResults: res.results })
          this.setState({ loadingSongs: false })
        })
    }

    onSimilarLimitChange(value) {
        this.setState({ loadingSimilar: true })
        this.setState({ selectedSimilarSongs: null })
        getSimilarSongs(this.state.selectedSongId, value).then(res => {
          this.setState({similarLimit: value})
          this.setState({ selectedSimilarSongs: res.results })
          this.setState({ loadingSimilar: false })
        })
    }

    onAttrLimitChange(value) {
        this.setState({ selectedAttrSongs: null })
        this.setState({ loadingAttr: true })
        getAttributeSongs(this.state.selectedSongId, this.state.selectedAttribute, value).then(res => {
          this.setState({ attrLimit: value})
          this.setState({ selectedAttrSongs: res.results })
          this.setState({ loadingAttr: false })
        })
    }

    onAttrChange(value) {
        this.setState({ loadingAttr: true })
        getAttributeSongs(this.state.selectedSongId, value, this.state.attrLimit).then(res => {
          this.setState({ selectedAttr: value})
          this.setState({ selectedAttrSongs: res.results })
          this.setState({ loadingAttr: false })
        })
    }

    handleLoginChange(isLoggedInValue, loggedInUserValue) {
        this.setState({ isLoggedIn: isLoggedInValue})
        this.setState({ loggedInUser: loggedInUserValue})
        // Redirect to homepage if logged out
        if (isLoggedInValue === false) {
            window.location.href = "/"
        }
    }

    toggleFavorite() {
        postToggleFavoriteSong(this.state.selectedIsFavorite, this.state.loggedInUser, this.state.selectedSongId).then(res => {
            console.log(res)
            if (res.successful) {
                this.setState({ selectedIsFavorite: res.nowIsFavorite })

              // Redirect to favorites page
              if (!res.nowIsFavorite) {
                window.location.href = "/favorites"
            }
            }
        })
    }

    componentDidMount() {
        this.setState({ loadingSongs: true })
        this.setState({ loadingAttr: true })
        this.setState({ loadingSimilar: true })

        getFavoriteSongs(this.state.loggedInUser, 100, null, null).then(res => {
            this.setState({ songsResults: res.results })
            this.setState({ loadingSongs: false })
        })
        if (this.state.selectedSongId) {
            getSong(this.state.selectedSongId).then(res => {
                if (this.state.selectedSongId) {
                    this.setState({ selectedSongDetails: res.results[0] })
                    var elem = document.getElementById("song-div");
                    const y = elem.getBoundingClientRect().top + window.pageYOffset - 100;
                    window.scrollTo({top: y, behavior: 'smooth'});
                } else {
                    this.setState({ selectedSongDetails: null })
                }
            })

            getSongArtists(this.state.selectedSongId).then(res => {
                if (this.state.selectedSongId) {
                    this.setState({ selectedSongArtists: res.results })
                } else {
                    this.setState({ selectedSongArtists: null })
                }
            })

            if (this.state.isLoggedIn) {
                getSongIsFavorite(this.state.loggedInUser, this.state.selectedSongId).then(res => {
                    if (res.successful) {
                        this.setState({ selectedIsFavorite: res.isFavorite })
                    }
                })
            }

            getSimilarSongs(this.state.selectedSongId, 10).then(res => {
                if (this.state.selectedSongId) {
                    this.setState({ selectedSimilarSongs: res.results })
                } else {
                    this.setState({ selectedSimilarSongs: null })
                }
                this.setState({ loadingSimilar: false })
            })

            getAttributeSongs(this.state.selectedSongId, this.state.selectedAttribute, 10).then(res => {
                if (this.state.selectedSongId) {
                    this.setState({ selectedAttrSongs: res.results })
                } else {
                    this.setState({ selectedAttrSongs: null })
                }
                this.setState({ loadingAttr: false })
            })
        }
    }

    render() {
        return (
            <div style={{ paddingBottom: 70 }}>
                <MenuBar
                    onLoginChange={this.handleLoginChange}
                />
                    <div style={{ width: '70vw', margin: '0 auto', marginTop: '10vh' }}>
                        <h3>My Favorite Songs</h3>
                        <Select defaultValue="100" style={{ width: 120 }} onChange={this.onSongLimitChange}>
                            <Option value="100">100</Option>
                            <Option value="200">200</Option>
                            <Option value="300">300</Option>
                            <Option value="400">400</Option>
                            <Option value="500">500</Option>
                        </Select>
                        <Table loading={this.state.loadingSongs} dataSource={this.state.songsResults} columns={songColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                    </div>
                {/* <Divider /> */}
                {this.state.selectedSongDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <center>
                        <div id="song-div" style={{ width: 'min(300px, 50%)', height: 5, backgroundColor: '#E37575', borderRadius: 1000, borderWidth: 0, margin: '20px 0 50px 0' }}/>
                    </center>
                    <center>
                        <h3 style={{ margin: 0, fontWeight: 600, marginBottom: 10 }}>{this.state.selectedSongDetails.song_name}</h3>
                        {this.state.selectedSongArtists ? 
                            <h5 style={{ margin: 0, fontWeight: 600 }}>{this.state.selectedSongArtists}</h5>
                        : null}
                    </center>
                    <Card style={{ marginTop: 30 }}>
                        <CardBody>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={6} style={{ textAlign: 'left' }}>
                                    Explicit
                                </Col >
                                <Col span={9} style={{ textAlign: 'center' }}>
                                    <h5>{this.state.selectedSongDetails.explicit === 1 ? "Yes" : "No"}</h5>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={6} style={{ textAlign: 'left' }}>
                                    Key
                                </Col >
                                <Col span={9} style={{ textAlign: 'center' }}>
                                    <h5>{this.state.selectedSongDetails.key}</h5>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={6} style={{ textAlign: 'left' }}>
                                    Loudness (decibels)
                                </Col >
                                <Col span={9} style={{ textAlign: 'center' }}>
                                    <h5>{this.state.selectedSongDetails.loudness}</h5>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={6} style={{ textAlign: 'left' }}>
                                    Mode
                                </Col >
                                <Col span={9} style={{ textAlign: 'center' }}>
                                    <h5>{this.state.selectedSongDetails.explicit === 1 ? "Major" : "Minor"}</h5>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={6} style={{ textAlign: 'left' }}>
                                    Tempo
                                </Col >
                                <Col span={9} style={{ textAlign: 'center' }}>
                                    <h5>{this.state.selectedSongDetails.tempo}</h5>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={6} style={{ textAlign: 'left' }}>
                                    Duration
                                </Col >
                                <Col span={9} style={{ textAlign: 'center' }}>
                                    <h5>{Math.trunc((this.state.selectedSongDetails.duration / 60000)) + ":" + Math.trunc((this.state.selectedSongDetails.duration - Math.trunc(this.state.selectedSongDetails.duration / 60000) * 60000) / 1000)}</h5>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={6} style={{ textAlign: 'left' }}>
                                    Time Signature
                                </Col >
                                <Col span={9} style={{ textAlign: 'center' }}>
                                    <h5>{this.state.selectedSongDetails.time_signature}</h5>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={6} style={{ textAlign: 'left' }}>
                                    Release Date
                                </Col >
                                <Col span={9} style={{ textAlign: 'center' }}>
                                    <h5>{this.state.selectedSongDetails.release_date ? this.state.selectedSongDetails.release_date.substring(5, 7) + "/" + this.state.selectedSongDetails.release_date.substring(8, 10) + "/" + this.state.selectedSongDetails.release_date.substring(0, 4) : "None"}</h5>
                                </Col>
                            </Row>
                            <Row gutter='20' align='middle' justify='center'>
                                <Col span={6} style={{ textAlign: 'left' }}>
                                    Maximum Chart Streams
                                </Col >
                                <Col span={9} style={{ textAlign: 'center' }}>
                                    <h5>{this.state.selectedSongDetails.max_streams ? this.state.selectedSongDetails.max_streams : 0}</h5>
                                </Col>
                            </Row>
                            {/* The progress bars can be really small, so we didn't put text inside of them */}
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={6} style={{ textAlign: 'left' }}>
                                    Danceability
                                </Col >
                                <Col span={9} style={{ textAlign: 'center' }}>
                                    <Progress value={this.state.selectedSongDetails.danceability * 100}></Progress>
                                </Col >
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={6} style={{ textAlign: 'left' }}>
                                    Energy
                                </Col >
                                <Col span={9} style={{ textAlign: 'center' }}>
                                    <Progress value={this.state.selectedSongDetails.energy * 100}></Progress>
                                </Col >
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={6} style={{ textAlign: 'left' }}>
                                    Speechiness
                                </Col >
                                <Col span={9} style={{ textAlign: 'center' }}>
                                    <Progress value={this.state.selectedSongDetails.speechiness * 100}></Progress>
                                </Col >
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={6} style={{ textAlign: 'left' }}>
                                    Acousticness
                                </Col >
                                <Col span={9} style={{ textAlign: 'center' }}>
                                    <Progress value={this.state.selectedSongDetails.acousticness * 100}></Progress>
                                </Col >
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={6} style={{ textAlign: 'left' }}>
                                    Instrumentalness
                                </Col >
                                <Col span={9} style={{ textAlign: 'center' }}>
                                    <Progress value={this.state.selectedSongDetails.instrumentalness * 100}></Progress>
                                </Col >
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={6} style={{ textAlign: 'left' }}>
                                    Liveness
                                </Col >
                                <Col span={9} style={{ textAlign: 'center' }}>
                                    <Progress value={this.state.selectedSongDetails.liveness * 100}></Progress>
                                </Col >
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={6} style={{ textAlign: 'left' }}>
                                    Valence
                                </Col >
                                <Col span={9} style={{ textAlign: 'center' }}>
                                    <Progress value={this.state.selectedSongDetails.valence * 100}></Progress>
                                </Col >
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                              {this.state.isLoggedIn ?
                                <Button style={{ marginTop: '3vh' }} onClick={this.toggleFavorite}>{this.state.selectedIsFavorite ? "Remove from Favorites" : "Add to Favorites"}</Button>
                                :
                                <p>Log in to save as a favorite!</p>
                              }
                            </Row>
                        </CardBody>
                    </Card>
                </div> : null}
                {this.state.selectedSongId ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '7vh' }}>
                    <h3>Top 10 Similar Songs</h3>
                        <Table loading={this.state.loadingSimilar} dataSource={this.state.selectedSimilarSongs} columns={similarSongColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </div> : null}
                {/* <Divider /> */}
                {this.state.selectedSongId ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
                    <h3>Similar Songs By Attribute</h3>
                        <Select defaultValue="danceability" style={{ width: 180 }} onChange={this.onAttrChange}>
                            <Option value="danceability">Danceability</Option>
                            <Option value="energy">Energy</Option>
                            <Option value="loudness">Loudness</Option>
                            <Option value="speechiness">Speechiness</Option>
                            <Option value="acousticness">Acousticness</Option>
                            <Option value="liveness">Liveness</Option>
                            <Option value="valence">Valence</Option>
                        </Select>
                        <Select defaultValue="10" style={{ width: 120 }} onChange={this.onAttrLimitChange}>
                            <Option value="10">10</Option>
                            <Option value="20">20</Option>
                            <Option value="20">30</Option>
                            <Option value="20">40</Option>
                            <Option value="20">50</Option>
                        </Select>
                        <Table loading={this.state.loadingAttr} dataSource={this.state.selectedAttrSongs} columns={similarSongColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </div> : null}
                {/* <Divider /> */}
            </div>
        )
    }
}

export default SongsPage

