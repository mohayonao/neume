export function getBindingKeyCommands(target) {
  const commands = [];

  Object.getOwnPropertyNames(Object.getPrototypeOf(target)).forEach((name) => {
    if (name.startsWith("key:")) {
      const macKey = name.slice(4);
      const winKey = macKey.replace("Command", "Ctrl");
      const bindKey = { mac: macKey, win: winKey };
      const exec = target[name].bind(target);

      commands.push({ bindKey, name, exec });
    }
  });

  return commands;
}

export function getSelection(editor) {
  const range = editor.getSelectionRange();

  if (range.isEmpty()) {
    range.setStart(range.start.row, 0);
    range.setEnd(range.end.row, Infinity);
  }

  const code = editor.getSession().getTextRange(range).trim();

  return { range, code };
}

export function flashSelection(editor, sel) {
  const { range } = sel;

  const session = editor.getSession();
  const markerId = session.addMarker(range, "ace_flash", "line");

  setTimeout(() => {
    session.removeMarker(markerId);
  }, 250);
}
