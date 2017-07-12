import React, { Component } from 'react';
import {numberToCurrency} from './Helpers';
import './styles/css/Month.css';

class Month extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: false,
    }
  }

  render() {
    const {
      date,
      month,
    } = this.props;

    let classNames = ["month"];

    let div = (
      <div style={{textAlign: 'center'}}>
        {numberToCurrency(month.principal)} / {numberToCurrency(month.interest)}
        <br /> {numberToCurrency(month.balance)}
      </div>
    )

    if (this.state.focused) {
      classNames.push("focus");
    } else {
      classNames = [...classNames.filter(n => n !== "focus")];
    }

    if (!month.pastMonth && !month.early && date.format("M") === "1") {
      classNames.push("year");
    }

    if (month.pastMonth) {
      classNames.push("past");
      div = <div>Paid Month</div>;
    }

    if (month.early) {
      classNames.push("early");
      div = <div>Paid Early!</div>;
    }

    return (
      <div className='monthContainer'>
        <p onClick={() => {this.setState({focused: !this.state.focused})}} className={classNames.join(" ")}></p>
        <span className='paymentPopover'>
          <div style={{textAlign: 'center'}}>{date.format("MMMM YYYY")}</div>
          {div}
        </span>
      </div>
    );
  }
}

export default Month;
