import { APP_UPDATED } from '../constants/ActionTypes';

const currentDate = new Date();
const initialState = {
  loanBalance: 100000,
  currentYear: currentDate.getFullYear(),
  startYear: currentDate.getFullYear(),
  startMonth: currentDate.getMonth() + 1,
  interestRate: 2.5,
  yearTerm: 15,
  currentBalance: 100000,
  extraMonthlyPayment: 0,
};

export default function appState(state = initialState, action) {
  switch (action.type) {
    case APP_UPDATED:
      return {
        ...state,
        ...action.state,
      };

    default:
      return state;
  }
}
