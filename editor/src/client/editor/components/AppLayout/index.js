import React, { Component } from "react";
import AppBody from "../AppBody";
import AppFooter from "../AppFooter";

class AppLayout extends Component {
  render() {
    return (
      <div className="AppLayout">
        <AppBody />
        <AppFooter />
      </div>
    );
  }
}

export default AppLayout;
