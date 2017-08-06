import { combineReducers, createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";
import isElectron from "is-electron";
import * as reducers from "./reducers";

export default function configureStore(initState) {
  const middlewares = [];
  const sagaMiddleware = createSagaMiddleware();
  const logger = createLogger();
  const reducer = combineReducers(reducers);

  middlewares.push(sagaMiddleware);

  if (isElectron() && process.env.NODE_ENV === "development") {
    middlewares.push(logger);
  }

  const store = createStore(reducer, initState, applyMiddleware(...middlewares));

  store.runSaga = sagaMiddleware.run;

  return store;
}
