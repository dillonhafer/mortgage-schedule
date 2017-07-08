import React, { Component } from 'react';
import './styles/css/App.css';
import moment from 'moment';
import Month from './Month';
import {numberToCurrency} from './Helpers';
import logo from './home.svg';

const MORTGAGE_SETTINGS = "mortgage_settings";

function getSettings() {
  const settings = localStorage.getItem(MORTGAGE_SETTINGS);
  if (settings === null) {
    return {};
  }

  return JSON.parse(window.atob(settings));
}

function saveSettings(json) {
  localStorage.setItem(
    MORTGAGE_SETTINGS,
    window.btoa(
      JSON.stringify(json)
    )
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    const currentDate = new Date();

    const savedSettings = getSettings();
    const defaultState = {
      loanBalance: 100000,
      currentYear: currentDate.getFullYear(),
      startYear: currentDate.getFullYear(),
      startMonth: currentDate.getMonth()+1,
      interestRate: 2.5,
      yearTerm: 15,
      currentBalance: 100000,
      extraMonthlyPayment: 0,
    }

    this.state = {
      ...defaultState,
      ...savedSettings,
    }
  }

  monthsSinceStart(year, month) {
    const today     = new Date();
    const startDate = moment([year, month, 1]);
    const endDate   = moment([today.getFullYear(), today.getMonth()+1, today.getDate()])
    return Math.abs(startDate.diff(endDate, 'months', true).toFixed());
  }

  setAndUpdateState = (state) => {
    this.setState(state);
    saveSettings({...this.state, ...state});
  }

  handleLoanBalanceChange = (e) => {
    if (isNaN(parseInt(e.target.value, 10))) {
      return alert("Please only input numbers");
    }
    this.setAndUpdateState({loanBalance: parseInt(e.target.value,10)});
  }

  handleCurrentBalanceChange = (e) => {
    const value = e.target.value.replace(/^0+/,'');
    if (isNaN(parseInt(value, 10))) {
      return this.setAndUpdateState({currentBalance: 0});
    }
    this.setAndUpdateState({currentBalance: parseInt(value,10)});
  }

  handleInterestRateChange = (e) => {
    this.setAndUpdateState({interestRate: parseFloat(e.target.value).toFixed(1)});
  }

  handleYearChange = (e) => {
    this.setAndUpdateState({startYear: parseInt(e.target.value,10)});
  }

  handleMonthChange = (e) => {
    this.setAndUpdateState({startMonth: parseInt(e.target.value,10)});
  }

  handleYearTermChange = (e) => {
    this.setAndUpdateState({yearTerm: parseInt(e.target.value,10)});
  }

  handleExtraMonthlyPaymentChange = (e) => {
    this.setAndUpdateState({extraMonthlyPayment: parseFloat(e.target.value)});
  }

  pmt(interest, payments, presentValue) {
    const exponent   = Math.pow(interest + 1.0, payments);
    const topLine    = interest * exponent;
    const bottomLine = exponent - 1.0;
    return presentValue * (topLine / bottomLine);
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
      extraMonthlyPayment,
    } = this.state;
    const years = [...Array(yearTerm).keys()];

    const interest = (interestRate / 100.00) / 12;
    const monthlyPayment = this.pmt(interest, 12 * yearTerm, loanBalance).toFixed(2);
    const completedMonths = this.monthsSinceStart(startYear, startMonth);
    const totalMonths = 12 * yearTerm;

    const firstMonthInterest = parseFloat((currentBalance * interest).toFixed(2));
    const firstMonthPrincipal = monthlyPayment - firstMonthInterest;

    let cv = currentBalance;
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
        _principal = monthlyPayment - _interest + extraMonthlyPayment;
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
          <img src={logo} alt="logo" />
          <h2>Fixed Rate Mortgage Schedule</h2>
        </div>
        <div className="App-intro">
          <label htmlFor="originalBalance">Original Balance: <b>{numberToCurrency(loanBalance)}</b></label>
          <input id="originalBalance" type="number" pattern="[0-9]*" min="1000" max="500000" step="1000" value={loanBalance} onChange={this.handleLoanBalanceChange} />

          <label htmlFor="currentBalance">Current Balance: <b>{numberToCurrency(currentBalance)}</b></label>
          <input id="currentBalance" type="number" pattern="[0-9]*" min="1000" max={loanBalance} step="1000" value={currentBalance} onChange={this.handleCurrentBalanceChange} />

          <label htmlFor="interestRate">Interest Rate: <b>{interestRate}%</b></label>
          <input id="interestRate" type="number" pattern="[0-9]*" min="0.10" max="30.00" value={interestRate} step="0.1" onChange={this.handleInterestRateChange} />

          <label htmlFor="extraMonthlyPayment">Extra Monthly Payment:</label>
          <input id="extraMonthlyPayment" value={extraMonthlyPayment} min="1" type="number" onChange={this.handleExtraMonthlyPaymentChange} />

          <label htmlFor="startMonth">Origin Date:</label>
          <div>
            <select id="startMonth" onChange={this.handleMonthChange} value={startMonth}>
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

          <label htmlFor="yearTerm">Loan Term:</label>
          <div>
            <select id="yearTerm" onChange={this.handleYearTermChange} value={yearTerm}>
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
        <div className="attribution-link">
          <a href="https://www.vexels.com/vectors/preview/135263/web-home-flat-sign">Web home flat sign</a> | designed by Vexels
        </div>
      </div>
    );
  }
}

export default App;
