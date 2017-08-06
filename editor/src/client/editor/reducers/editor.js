import * as ActionTypes from "../actions/editor";

export const initState = {
  tabs: [
    { tabId: 0, uri: "editor:", content: "" },
  ],
  selected: 0,
};

function findIndex(tabs, tabId, uri) {
  return tabs.findIndex((tab) => tab.tabId === tabId || tab.uri === uri);
}

export function selectTab(state, { tabId, uri }) {
  const index = findIndex(state.tabs, tabId, uri);

  if (index === -1) {
    return state;
  }

  const selected = state.tabs[index].tabId;

  return Object.assign({}, state, { selected });
}

export function appendTab(state, { tabId, uri, content }) {
  const index = findIndex(state.tabs, tabId, uri);

  if (index !== -1) {
    return selectTab(state, { uri });
  }

  const tabs = state.tabs.concat({ tabId, uri, content });
  const selected = tabId;

  return Object.assign({}, state, { tabs, selected });
}

export function removeTab(state, { tabId }) {
  const index = findIndex(state.tabs, tabId);

  if (index === -1) {
    return state;
  }

  const tabs = state.tabs.slice(0, index).concat(
    state.tabs.slice(index + 1)
  );
  const selected = state.selected === tabId ?
    (tabs[index] || tabs[index - 1]).tabId : state.selected;

  return Object.assign({}, state, { tabs, selected });
}

export function renameTab(state, { tabId, uri }) {
  const tabs = state.tabs.map((item) => {
    return item.tabId === tabId ? Object.assign({}, item, { uri }) : item;
  });

  return Object.assign({}, state, { tabs });
}

export function setContent(state, { tabId, content}) {
  const tabs = state.tabs.map((item) => {
    return item.tabId === tabId ? Object.assign({}, item, { content }) : item;
  });

  return Object.assign({}, state, { tabs });
}

export default (state = initState, action) => {
  switch (action.type) {
  case ActionTypes.SELECT_TAB:
    return selectTab(state, action.payload);
  case ActionTypes.APPEND_TAB:
    return appendTab(state, action.payload);
  case ActionTypes.REMOVE_TAB:
    return removeTab(state, action.payload);
  case ActionTypes.RENAME_TAB:
    return renameTab(state, action.payload);
  case ActionTypes.SET_CONTENT:
    return setContent(state, action.payload);
  }
  return state;
};
