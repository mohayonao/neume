import url from "url";
import { takeEvery, fork, call, put, select } from "redux-saga/effects";
import * as ActionTypes from "../actions/editor";

let _tabId = 0;

function nextTabId() {
  return ++_tabId;
}

function selectEditor(state) {
  return state.editor;
}

export function* initEditor() {
  const editorTab = yield select(selectEditor);

  _tabId = Math.max(...editorTab.tabs.map(({ tabId }) => tabId));
}

export function* handleNewFile(/* api */) {
  const tabId = nextTabId();
  const uri = url.format({
    protocol: "new-file", pathname: Date.now()
  }).toString();

  yield put(ActionTypes.appendTab(tabId, uri, ""));
}

export function* handleOpenFile(api) {
  const tabId = nextTabId();
  const res = yield call(api.openFile);

  // TODO: res.error

  if (!res.error) {
    yield put(ActionTypes.appendTab(tabId, res.uri, res.content));
  }
}

export function* handleSaveFile(api, { payload: { tabId, uri, content } }) {
  const res = yield call(api.saveFile, uri, content);
  const { protocol, pathname } = url.parse(uri);

  // TODO: res.error

  if (!res.error) {
    if (protocol === "new-file:") {
      if (pathname) {
        yield put(ActionTypes.renameTab(tabId, res.uri));
      } else {
        yield put(ActionTypes.appendTab(nextTabId(), res.uri, content));
      }
    }
  }
}

export default function* editorSaga(api) {
  yield takeEvery(ActionTypes.NEW_FILE, handleNewFile, api);
  yield takeEvery(ActionTypes.OPEN_FILE, handleOpenFile, api);
  yield takeEvery(ActionTypes.SAVE_FILE, handleSaveFile, api);
  yield fork(initEditor, api);
}
