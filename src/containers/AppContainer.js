import { connect } from 'react-redux';
import App from '../App';
import { updateState } from '../actions/App';

export default connect(
  state => ({
    ...state.appState,
  }),
  dispatch => ({
    updateState: state => {
      dispatch(updateState(state));
    },
  })
)(App);
