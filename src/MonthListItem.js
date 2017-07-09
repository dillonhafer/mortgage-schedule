import React, { Component } from 'react';
import moment from 'moment';
import {numberToCurrency} from './Helpers';

class MonthListItem extends Component {
  render() {
    const {
      date,
      month,
    } = this.props;

    let style = {}
    if (date.format("MMMM") === "January") {
      style.background = "#76abff";
      style.color = "white";
    }

    return (
      <tr style={style}>
        <td>{date.format("MMMM YYYY")}</td>
        <td>{numberToCurrency(month.principal)}</td>
        <td>{numberToCurrency(month.interest)}</td>
        <td>{numberToCurrency(month.balance)}</td>
      </tr>
    );
  }
}

export default MonthListItem;
