import fs from "fs";
import url from "url";
import { remote } from "electron";

////////////////////////////////////////////////////////////////////////////////
function showOpenDialog() {
  return new Promise((resolve) => {
    remote.dialog.showOpenDialog({
      properties: [ "openFile" ],
      filters: [
        { name: "JavaScript", extensions: [ "js" ] },
      ]
    }, (filePaths) => {
      if (filePaths) {
        resolve(filePaths[0]);
      }
    });
  });
}

function readFile(filepath) {
  return new Promise((resolve) => {
    fs.readFile(filepath, "utf-8", (error, content) => {
      if (error) {
        return resolve({ error });
      }
      const uri = url.format({
        protocol: "file", pathname: filepath
      }).toString();

      return resolve({ uri, content });
    });
  });
}

////////////////////////////////////////////////////////////////////////////////
function showSaveDialog() {
  return new Promise((resolve) => {
    remote.dialog.showSaveDialog(null, {
      filters: [
        { name: "JavaScript", extensions: [ "js" ] },
      ]
    }, resolve);
  });
}

function writeFile(filepath, content) {
  return new Promise((resolve) => {
    fs.writeFile(filepath, content, (error) => {
      if (error) {
        return resolve({ error });
      }
      const uri = url.format({
        protocol: "file", pathname: filepath,
      }).toString();
      return resolve({ uri, content });
    });
  });
}

////////////////////////////////////////////////////////////////////////////////
export function openFile() {
  return openFile["file:"]();
}

openFile["file:"] = () => {
  return showOpenDialog().then(readFile);
};

////////////////////////////////////////////////////////////////////////////////
export function saveFile(uri, content) {
  const { protocol, pathname } = url.parse(uri);

  if (typeof saveFile[protocol] === "function") {
    return saveFile[protocol](pathname, content);
  }

  return Promise.resolve({
    error: new Error(`
      Failed to write a file; unknown protocol: '${ protocol }'
    `),
  });
}

saveFile["editor:"] = (_, content) => {
  return Promise.resolve({ uri: "editor:", content });
};

saveFile["new-file:"] = (uri, content) => {
  return showSaveDialog().then((filepath) => {
    return writeFile(filepath, content);
  });
};

saveFile["file:"] = (filepath, content) => {
  return writeFile(filepath, content);
};
