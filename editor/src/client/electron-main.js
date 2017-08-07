import editor from "./editor";
import { createAPI } from "./api";
import * as electronAPI from "./api/electron";
import neume from "../../../src/index-node";

const neu = neume({ port: 57150 });

Object.assign(global, { neu: neu }, neu, neu.scapi);

const api = createAPI(neu, electronAPI);

editor(api, document.getElementById("app"));
