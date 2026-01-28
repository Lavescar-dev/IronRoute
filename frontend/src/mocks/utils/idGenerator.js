let currentId = 1000;

export function nextId() {
  return ++currentId;
}

export function resetId(start = 1000) {
  currentId = start;
}
