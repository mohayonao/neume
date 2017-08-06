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
