import { fork } from "redux-saga/effects";
import * as sagas from "./sagas";

export default function configureRootSaga(api) {
  return function* rootSaga() {
    for (const name of Object.keys(sagas)) {
      yield fork(sagas[name], api);
    }
  };
}
