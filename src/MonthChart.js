import React, { Component } from 'react';
import Month from './Month';
import MonthListItem from './MonthListItem';
import moment from 'moment';
import {
  MdViewComfortable,
  MdViewList,
} from 'react-icons/lib/md';

class MonthChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartType: "grid"
    }
  }

  handleChartTypeChange = (e) => {
    const chartType = e.target.value === "grid" ? "grid" : "list";
    this.setState({chartType});
  }

  renderGrid(months, startYear, startMonth) {
    return (
      months.map((month,i) => {
        const date = moment([startYear, startMonth, 1]).add(i, 'M')
        return <Month key={i} month={month} date={date} />
      })
    );
  }

  renderList(months, startYear, startMonth) {
    const validMonth = (month) => {
      return !month.pastMonth && !month.early
    }

    const today = new Date();

    return (
      <table className="scheduleChart">
        <thead>
          <tr>
            <th>Date</th>
            <th>Principal</th>
            <th>Interest</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
        {
          months.filter(validMonth).map((month,i) => {
            const date = moment([today.getFullYear(), today.getMonth()+1, 1]).add(i, 'M')
            return <MonthListItem key={i} month={month} date={date} />
          })
        }
        </tbody>
      </table>
    );
  }

  render() {
    const {
      months,
      startYear,
      startMonth,
    } = this.props;

    const {
      chartType,
    } = this.state;
    const renderChart = chartType === "grid" ? this.renderGrid : this.renderList;

    return (
      <div>
        <div className="chartTypeSegment">
          <input id="gridRadio"
                 type="radio"
                 value="grid"
                 checked={chartType === "grid"}
                 onChange={this.handleChartTypeChange} />
          <label className="first" htmlFor="gridRadio"><MdViewComfortable /> <span>Grid</span></label>

          <input id="listRadio"
                 type="radio"
                 value="list"
                 checked={chartType === "list"}
                 onChange={this.handleChartTypeChange} />
          <label htmlFor="listRadio" className="last"><MdViewList /> <span>List</span></label>
        </div>
        <div className='monthChart'>
          {renderChart(months, startYear, startMonth)}
        </div>
      </div>
    );
  }
}

export default MonthChart;
