import { takeEvery, call } from "redux-saga/effects";
import * as ActionTypes from "../actions/neume";

export function* handleReset(api) {
  yield call(api.reset);
}

export default function* neumeSaga(api) {
  yield takeEvery(ActionTypes.RESET, handleReset, api);
}
