import React, { Component } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import SubViewAbout from "../SubViewAbout";

const tabs = [
  { name: "about", SubView: SubViewAbout },
];

class PaneSubView extends Component {
  render() {
    return (
      <div className="PaneSubView">
        <Tabs>
          { this.renderTabList(tabs) }
          { this.renderTabPanels(tabs) }
        </Tabs>
      </div>
    );
  }

  renderTabList(tabs) {
    return (
      <TabList>
        { tabs.map(({ name }) => <Tab key={ name }>{ name }</Tab>) }
      </TabList>
    );
  }

  renderTabPanels(tabs) {
    return tabs.map(({ name, SubView }) => {
      return (<TabPanel key={ name }><SubView /></TabPanel>);
    });
  }
}

export default PaneSubView;
