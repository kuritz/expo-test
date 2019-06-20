import { createStore } from 'redux';
import reducer from '../reducers';

const initialState = {
  isLoading: true,
  playlist: null,
  city: null,
  user: null
};

export default store = createStore(reducer, initialState);
