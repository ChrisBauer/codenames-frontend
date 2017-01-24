import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise';
import horizonRedux from '../horizon/redux';

import rootReducer from '../reducer';

const hzMiddleware = horizonRedux.createMiddleware();
const enhancer = compose(
  applyMiddleware(hzMiddleware, promiseMiddleware)
)(createStore);

export default function configureStore(initialState) {
  return enhancer(rootReducer, initialState);
}
