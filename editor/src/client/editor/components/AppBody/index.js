import React, { Component } from "react";
import SplitPane from "react-split-pane";
import PaneEditor from "../PaneEditor";
import PaneSubView from "../PaneSubView";

class AppBody extends Component {
  render() {
    return (
      <div className="AppBody">
        <SplitPane split="vertical" size="65%" minSize={ 50 } maxSize={ -50 }>
          <PaneEditor />
          <PaneSubView />
        </SplitPane>
      </div>
    );
  }
}

export default AppBody;
