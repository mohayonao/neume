import editor from "./editor";
import { createAPI } from "./api";
import * as electronAPI from "./api/electron";

const api = createAPI(electronAPI);

editor(api, document.getElementById("app"));
