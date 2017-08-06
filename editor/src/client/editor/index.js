import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import AppLayout from "./components/AppLayout";
import configureStore from "./configureStore";
import configureRootSaga from "./configureRootSaga";

export default function editor(api, elem) {
  const initState = api.loadState();
  const store = configureStore(initState);
  const rootSaga = configureRootSaga(api);

  store.runSaga(rootSaga);

  ReactDOM.render(
    <Provider store={ store }>
      <AppLayout />
    </Provider>
  , elem);
}
