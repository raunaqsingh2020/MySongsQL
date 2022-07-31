// Page used to display the leaderboard of artists at the top of charts
import React from 'react';


import {
    Table
} from 'antd'

import { leaderboard } from '../fetcher'


import MenuBar from '../components/MenuBar';

// Defines the columns of the leaderboard table
const leaderboardColumns = [
    {
      title: 'Artist Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, row) => <a href={`/artists?id=${row.artist_id}&name=${row.name}`}>{text}</a>
    },
    {
      title: 'First Place Count',
      dataIndex: 'first_place_count',
      key: 'first_place_count',
      sorter: (a, b) => a.first_place_count - b.first_place_count
    }, 
    {
      title: 'Total Streams',
      dataIndex: 'total_streams',
      key: 'total_streams',
      sorter: (a, b) => a.total_streams - b.total_streams
    }
];

class LeaderboardPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            leaderboard: [],
            loadingLeaderboard: false
        }
    }

    componentDidMount() {
        // Causes an initial visual loading state, changed whenever the query completes
        this.setState({ loadingLeaderboard: true })
        // Gets the table of leaderboard entries for the artists at the top of charts
        leaderboard().then(res => {
            this.setState({ leaderboard: res.results })
            this.setState({ loadingLeaderboard: false })
        })
    }

    render() {
        return (
            <div style={{ paddingBottom: 35 }}>
                <MenuBar />
                {/* Displays the leaderboard of the artists at the top of charts*/}
                <div style={{ width: '70vw', margin: '0 auto', marginTop: '9vh' }}>
                    <h3>Artist Leaderboard</h3>
                    <Table loading={this.state.loadingLeaderboard} dataSource={this.state.leaderboard} columns={leaderboardColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </div>
            </div>
        )
    }
}

export default LeaderboardPage