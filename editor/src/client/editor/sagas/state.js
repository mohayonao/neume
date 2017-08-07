import { delay } from "redux-saga";
import { fork, take, call, cancel, select } from "redux-saga/effects";

export function* saveState(api) {
  yield call(delay, 1000);
  yield call(api.saveState, yield select());
}

export function* handleUpdateState(api) {
  let task;
  for (;;) {
    yield take("*");
    if (task) {
      yield cancel(task);
    }
    task = yield fork(saveState, api);
  }
}

export default function* stateSaga(api) {
  yield fork(handleUpdateState, api);
}
