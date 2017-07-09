import React, { Component } from 'react';
import Month from './Month';
import moment from 'moment';

class MonthChart extends Component {
  render() {
    const {
      months,
      startYear,
      startMonth,
    } = this.props;

    return (
      <div className='monthChart'>
        {
          months.map((month,i) => {
            const date = moment([startYear, startMonth, 1]).add(i, 'M')
            return <Month key={i} month={month} date={date} />
          })
        }
      </div>
    );
  }
}

export default MonthChart;
