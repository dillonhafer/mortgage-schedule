import React, { Component } from 'react';
import './styles/css/App.css';
import moment from 'moment';
import parse from 'url-parse';
import Month from './Month';
import {numberToCurrency} from './Helpers';

class App extends Component {
  constructor(props) {
    super(props);
    const currentDate = new Date();

    const url = parse(window.location, true);
    const {
      loanBalance,
      startYear,
      startMonth,
      interestRate,
      yearTerm,
      currentBalance,
    } = url.query;

    let defaultState = {
      loanBalance: 1,
      currentYear: currentDate.getFullYear(),
      startYear: currentDate.getFullYear(),
      startMonth: currentDate.getMonth()+1,
      interestRate: 2.5,
      yearTerm: 15,
      currentBalance: 1,
    }

    if (loanBalance !== undefined) {
      defaultState.loanBalance = parseInt(loanBalance, 10);
    }
    if (startYear !== undefined) {
      defaultState.startYear = parseInt(startYear, 10);
    }
    if (startMonth !== undefined) {
      defaultState.startMonth = parseInt(startMonth, 10);
    }
    if (yearTerm !== undefined) {
      defaultState.yearTerm = parseInt(yearTerm, 10);
    }
    if (interestRate !== undefined) {
      defaultState.interestRate = parseFloat(interestRate).toFixed(1);
    }
    if (currentBalance !== undefined) {
      defaultState.currentBalance = parseInt(currentBalance, 10);
    }

    this.state = defaultState;
  }

  monthsSinceStart(year, month) {
    const today     = new Date();
    const startDate = moment([year, month, 1]);
    const endDate   = moment([today.getFullYear(), today.getMonth()+1, today.getDate()])
    return Math.abs(startDate.diff(endDate, 'months', true).toFixed());
  }


  handleLoanBalanceChange = (e) => {
    if (isNaN(parseInt(e.target.value, 10))) {
      return alert("Please only input numbers");
    }
    this.setState({loanBalance: parseInt(e.target.value,10)});
  }

  handleCurrentBalanceChange = (e) => { if (isNaN(parseInt(e.target.value, 10))) { return alert("Please only input numbers");
    }
    this.setState({currentBalance: parseInt(e.target.value,10)});
  }

  handleInterestRateChange = (e) => {
    this.setState({interestRate: parseFloat(e.target.value).toFixed(1)});
  }

  handleYearChange = (e) => {
    this.setState({startYear: parseInt(e.target.value,10)});
  }

  handleMonthChange = (e) => {
    this.setState({startMonth: parseInt(e.target.value,10)});
  }

  handleYearTermChange = (e) => {
    this.setState({yearTerm: parseInt(e.target.value,10)});
  }

  pmt(interest, payments, presentValue) {
    const exponent   = Math.pow(interest + 1.0, payments);
    const topLine    = interest * exponent;
    const bottomLine = exponent - 1.0;
    return (presentValue * 1000) * (topLine / bottomLine);
  }

  render() {
    const {
      currentYear,
      startYear,
      loanBalance,
      startMonth,
      interestRate,
      yearTerm,
      currentBalance,
    } = this.state;
    const years = [...Array(yearTerm).keys()];

    const interest = (interestRate / 100.00) / 12;
    const monthlyPayment = this.pmt(interest, 12 * yearTerm, loanBalance).toFixed(2);
    const completedMonths = this.monthsSinceStart(startYear, startMonth);
    const totalMonths = 12 * yearTerm;

    const firstMonthInterest = parseFloat(((currentBalance * interest) * 1000).toFixed(2));
    const firstMonthPrincipal = monthlyPayment - firstMonthInterest;

    let cv = currentBalance * 1000;
    const _months = [...Array(totalMonths).keys()].map((month, i) => {
      const pastMonth = i < completedMonths;
      let _principal   = 0.00;
      let _interest    = 0.00;
      let _balance     = cv

      if (i === completedMonths) {
        _principal = firstMonthPrincipal
         _interest = firstMonthInterest
        _balance = cv - _principal
        cv = _balance
      } else if (i > completedMonths) {
         _interest = parseFloat((cv * interest).toFixed(2));
        _principal = monthlyPayment - _interest;
          _balance = cv - _principal
        cv = _balance
      }

      const early = Math.max(_balance, 0) === 0;
      return {
        pastMonth,
        principal: _principal,
        interest: _interest,
        balance: Math.max(_balance, 0),
        early,
      }
    });

    const earlyMonths = _months.filter(m => m.early).length;

    return (
      <div className="App">
        <div className="App-header">
          <h2>Fixed Rate Mortgage Schedule</h2>
        </div>
        <div className="App-intro">
          <label>Original Balance: <b>{numberToCurrency(loanBalance*1000)}</b></label>
          <input className="range-input" type="range" min="1" max="500" value={loanBalance} onChange={this.handleLoanBalanceChange} />

          <label>Current Balance: <b>{numberToCurrency(currentBalance * 1000)}</b></label>
          <input className="range-input" type="range" min="1" max={loanBalance} value={currentBalance} onChange={this.handleCurrentBalanceChange} />

          <label htmlFor="interestRate">Interest Rate: <b>{interestRate}%</b></label>
          <input name="interestRate" className="range-input" type="range" min="0.10" max="30.00" value={interestRate} step="0.1" onChange={this.handleInterestRateChange} />

          <label>Origin Date:</label>
          <div>
            <select onChange={this.handleMonthChange} value={startMonth}>
              {
                moment.months().map((m, i) => {
                  return <option value={i+1} key={i}>{m}</option>;
                })
              }
            </select>
            <select onChange={this.handleYearChange} value={startYear}>
              {
                years.map((y) => {
                  const year = currentYear - y;
                  return <option key={y} value={year}>{year}</option>;
                })
              }
            </select>
          </div>

          <label>Loan Term:</label>
          <div>
            <select onChange={this.handleYearTermChange} value={yearTerm}>
              {
                [...Array(30).keys()].map((y) => {
                  const year = y + 1;
                  return <option key={y} value={year}>{year} {year === 1 ? "year" : "years"}</option>;
                })
              }
            </select>
          </div>

          <p className='remainingLabel'>
            Completed <b>({completedMonths} / {totalMonths})</b> months. <b>{totalMonths - completedMonths - earlyMonths}</b> months remain.
          </p>
          <p className='remainingLabel'>
            Monthly Payment: <b>{numberToCurrency(monthlyPayment)}</b>
          </p>
          <div className='monthChart'>
            {
              _months.map((month,i) => {
                const date = moment([startYear, startMonth, 1]).add(i, 'M')
                return <Month key={i} month={month} date={date} />
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
