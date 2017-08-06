const STATE_LOCATION = "NEUME_EDITOR_STATE";

export function loadState() {
  const state = localStorage.getItem(STATE_LOCATION);

  return state ? JSON.parse(state) : {};
}

export function saveState(state) {
  const filteredState = filterState(state);
  const jsonState = JSON.stringify(filteredState);

  localStorage.setItem(STATE_LOCATION, jsonState);
}

function filterState(state) {
  return state;
}
