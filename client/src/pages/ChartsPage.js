// Page used to display charts and perform chart search
import React from 'react';
import { Button} from "shards-react";
import {
  Table,
  Select
} from 'antd'
import { searchChart } from '../fetcher'
import MenuBar from '../components/MenuBar';
import regionOptions from '../assets/regionOptions.json'
import dateOptions from '../assets/dateOptions.json'
const { Option } = Select;

// Defines the columns of the main chart table
const chartColumns = [
  {
    title: 'Song Title',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (text, row) => <a href={`/songs?id=${row.id}`}>{text}</a>
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    sorter: (a, b) => a.date.localeCompare(b.date),
    render: (text, row) => row.date.substring(0, 10)
  },
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
    sorter: (a, b) => a.rank - b.rank
  },
  {
    title: 'Region',
    dataIndex: 'region',
    key: 'region',
    sorter: (a, b) => a.region.localeCompare(b.region)
  },
  {
    title: 'Trend',
    dataIndex: 'trend',
    key: 'trend',
    sorter: (a, b) => a.trend.localeCompare(b.trend),
    render: (text, row) => (text === "MOVE_DOWN") ? "Move Down" : (text === "NEW ENTRY") ? "New Entry" : "Move Up"
  },
  {
    title: 'Streams',
    dataIndex: 'streams',
    key: 'streams',
    sorter: (a, b) => a.streams - b.streams
  }
];
class ChartsPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      chartResults: [],
      chartQuery: "",
      dateQuery: "",
      regionQuery: "United States",
      loadingChart: false,
    }

    this.onChartChange = this.onChartChange.bind(this)
    this.onDateChange = this.onDateChange.bind(this)
    this.onRegionChange = this.onRegionChange.bind(this)
    this.updateSearchResults = this.updateSearchResults.bind(this)

  }

  // Updates chartQuery state every time the user selects a new type of chart
  onChartChange(value) {
    this.setState({ loadingChart: true })
    searchChart(this.state.dateQuery, value, this.state.regionQuery).then(res => {
      this.setState({ chartQuery: value })
      this.setState({ chartResults: res.results })
      this.setState({ loadingChart: false })
    })
  }

  // Updates dateQuery state every time the user types something new in the date search box
  onDateChange(event) {
    this.setState({ dateQuery: event.target.value })
  }

  // Updates regionQuery state every time the user types something new in the region search box
  onRegionChange(event) {
    this.setState({ regionQuery: event.target.value })
  }

  // Called whenever the search button is pressed, refreshes the results in the charts table based on the queries
  updateSearchResults() {
    this.setState({ loadingChart: true })
    searchChart(this.state.dateQuery, this.state.chartQuery, this.state.regionQuery).then(res => {
        this.setState({ chartResults: res.results })
        this.setState({ loadingChart: false })
    })
  }

  componentDidMount() {
    // Causes an initial visual loading state, changed whenever the query completes
    this.setState({ loadingChart: true })
    // Gets the table of charts results at the top of the page
    searchChart(this.state.dateQuery, this.state.chartQuery, this.state.regionQuery).then(res => {
      this.setState({ chartResults: res.results })
      this.setState({ loadingChart: false })
    })
  }

  render() {
    return (
      <div style={{ paddingBottom: 50 }}>
        <MenuBar />
        {/* Input fields and search button that handles searching for entries in the charts */}
        <div style={{ width: '100vw', margin: '0 0', marginTop: '5vh', display: 'flex', justifyContent: 'center' }}>
            <div style={{ padding: 0, margin: 0, }}>
                <h6 style={{ margin: 0, fontWeight: 600 }}>Chart Search:</h6>
                <div style={{ display: 'flex', flexDirection: 'row', margin: 0 }}>
                    <select style={{ 
                        width: 'max(150px, 20vw)', height: '50px', borderRadius: '1000px', borderWidth: 0, padding: 13, margin: '20px 20px 20px 0', boxShadow: '0px 0px 15px #00000020',
                        }} placeholder="Date (yyyy-mm-dd)" onChange={this.onDateChange}>
                        {dateOptions.map((item) => (
                          <option value={item.value}>{item.displayName}</option>
                        ))}
                    </select>
                    <select style={{ 
                        width: 'max(150px, 20vw)', height: '50px', borderRadius: '1000px', borderWidth: 0, padding: 13, margin: '20px 20px 20px 12px', boxShadow: '0px 0px 15px #00000020',
                        }} placeholder="Region" onChange={this.onRegionChange}>
                        {regionOptions.map((item) => (
                          <option value={item.value}>{item.displayName}</option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', margin: 0 }}>
                    <Button pill theme="dark" style={{ marginTop: '1vh' }} onClick={this.updateSearchResults}>Search</Button>
                </div>
            </div>
        </div>
        {/* Displays the chart data that result from the chart search */}
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>Charts</h3>
          <Select defaultValue="top200" style={{ width: 120 }} onChange={this.onChartChange}>
            <Option value="viral50">Viral 50</Option>
            <Option value="top200">Top 200</Option>
          </Select>
          <Table loading={this.state.loadingChart} dataSource={this.state.chartResults} columns={chartColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        </div>

      </div>
    )
  }
}

export default ChartsPage

