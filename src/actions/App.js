import { APP_UPDATED } from '../constants/ActionTypes';

export function updateState(state) {
  return {
    type: APP_UPDATED,
    state,
  };
}
