import { takeEvery, call } from "redux-saga/effects";
import * as ActionTypes from "../actions/repl";

export function* executeCode(api, { payload: { code } }) {
  const res = yield call(api.executeCode, code, {});

  if (res.error) {
    global.console.error(res.error);
  } else {
    global.console.log(res.result);
  }
}

export default function* replSaga(api) {
  yield takeEvery(ActionTypes.EXECUTE_CODE, executeCode, api);
}
