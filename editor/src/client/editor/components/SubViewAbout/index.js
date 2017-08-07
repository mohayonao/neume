import React, { Component } from "react";
import RepoLinkList from "./RepoLinkList";

const repoLinks = [
  { name: "Repository", link: "https://github.com/mohayonao/neume" },
  { name: "Issues"    , link: "https://github.com/mohayonao/neume/issues" },
];

class SubViewAbout extends Component {
  render() {
    return (
      <div className="SubViewAbout">
        { this.renderHeader() }
        <RepoLinkList repoLinks={ repoLinks } />
      </div>
    );
  }

  renderHeader() {
    return (
      <header>
        <h1>Neume Editor</h1>
        <div className="description">
          Live coding environment for Neume.js
        </div>
      </header>
    );
  }
}

export default SubViewAbout;
