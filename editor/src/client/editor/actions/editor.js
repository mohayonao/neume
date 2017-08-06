export const NEW_FILE = "EDITOR.NEW_FILE";
export const OPEN_FILE = "EDITOR.OPEN_FILE";
export const SAVE_FILE = "EDITOR.SAVE_FILE";
export const SELECT_TAB = "EDITOR.SELECT_TAB";
export const APPEND_TAB = "EDITOR.APPEND_TAB";
export const REMOVE_TAB = "EDITOR.REMOVE_TAB";
export const RENAME_TAB = "EDITOR.RENAME_TAB";
export const SET_CONTENT = "EDITOR.SET_CONTENT";

export function newFile() {
  return { type: NEW_FILE };
}

export function openFile() {
  return { type: OPEN_FILE };
}

export function saveFile(tabId, uri, content) {
  return { type: SAVE_FILE, payload: { tabId, uri, content } };
}

export function selectTab(tabId) {
  return { type: SELECT_TAB, payload: { tabId } };
}

export function appendTab(tabId, uri, content = "") {
  return { type: APPEND_TAB, payload: { tabId, uri, content } };
}

export function removeTab(tabId) {
  return { type: REMOVE_TAB, payload: { tabId } };
}

export function renameTab(tabId, uri) {
  return { type: RENAME_TAB, payload: { tabId, uri } };
}

export function setContent(tabId, content) {
  return { type: SET_CONTENT, payload: { tabId, content } };
}
