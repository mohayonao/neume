import url from "url";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import JSEditor from "./JSEditor";
import DeleteButton from "../shared/DeleteButton";
import * as actions from "../../actions";
import * as aceUtils from "./ace/utils";

import "brace/mode/javascript";
import "./ace/theme/neume";

class PaneEditor extends Component {
  constructor(props) {
    super(props);

    this._editorProps = {
      focus: true,
      onChange: this._updateContent.bind(this),
      commands: aceUtils.getBindingKeyCommands(this),
    };

    this.actions = this.props.actions;
    this.selectTab = this.selectTab.bind(this);
    this.removeTab = this.removeTab.bind(this);
  }

  _updateContent(content) {
    const { tabId } = this.getCurrentTab();

    this.actions.setContent(tabId, content);
  }

  getCurrentTabIndex() {
    const { tabs, selected } = this.props;

    return Math.max(0, tabs.findIndex(({ tabId }) => tabId === selected));
  }

  getCurrentTab() {
    const { tabs } = this.props;

    return tabs[this.getCurrentTabIndex()];
  }

  selectTab(tabIndex) {
    const { tabs } = this.props;

    this.actions.selectTab(tabs[tabIndex].tabId);
  }

  removeTab({ currentTarget }) {
    const tabId = +currentTarget.getAttribute("data-tab-id");

    this.actions.removeTab(tabId);
  }

  render() {
    const { tabs } = this.props;
    const tabIndex = this.getCurrentTabIndex();

    return (
      <div className="PaneEditor">
        <Tabs selectedIndex={ tabIndex } onSelect={ this.selectTab }>
          { this.renderTabList(tabs) }
          { this.renderTabPanels(tabs) }
          { this.renderEditor() }
        </Tabs>
      </div>
    );
  }

  renderTabList(tabs) {
    const elems = tabs.map(({ tabId, uri }) => {
      const deleteButton = tabId === 0 ? null :
        <DeleteButton data-tab-id={ tabId } onClick={ this.removeTab }/>

      return (<Tab key={ tabId }>{ toTabName(uri) }{ deleteButton }</Tab>)
    });

    return (
      <TabList>{ elems }</TabList>
    );
  }

  renderTabPanels(tabs) {
    return tabs.map((_, index) => {
      return (<TabPanel key={ index }></TabPanel>);
    });
  }

  renderEditor() {
    const { tabId, content } = this.getCurrentTab();

    return (
      <JSEditor editorProps={ this._editorProps } tabId={ tabId } content={ content } />
    );
  }

  ["key:Command-Enter"](editor) {
    const sel = aceUtils.getSelection(editor);

    if (sel.code !== "") {
      aceUtils.flashSelection(editor, sel);
    }

    this.actions.executeCode(sel.code);
  }

  ["key:Command-."]() {
    this.actions.reset();
  }

  ["key:Command-N"]() {
    this.actions.newFile();
  }

  ["key:Command-O"]() {
    this.actions.openFile();
  }

  ["key:Command-S"](editor) {
    const { tabId, uri } = this.getCurrentTab();
    const content = editor.getSession().getValue();

    this.actions.saveFile(tabId, uri, content);
  }

  ["key:Command-Shift-S"](editor) {
    const { tabId } = this.getCurrentTab();
    const content = editor.getSession().getValue();

    this.actions.saveFile(tabId, "new-file:", content);
  }

  ["key:Command-W"]() {
    const { tabId } = this.getCurrentTab();

    this.actions.removeTab(tabId);
  }

  ["key:Command-["]() {
    const { tabs } = this.props;
    const tabIndex = Math.max(0, this.getCurrentTabIndex() - 1);

    this.actions.selectTab(tabs[tabIndex].tabId);
  }

  ["key:Command-]"]() {
    const { tabs } = this.props;
    const tabIndex = Math.min(this.getCurrentTabIndex() + 1, tabs.length - 1);

    this.actions.selectTab(tabs[tabIndex].tabId);
  }
}

function toTabName(uri) {
  const { protocol, pathname } = url.parse(uri);

  if (protocol === "editor:") {
    return "EDITOR";
  }

  if (protocol === "file:") {
    return pathname.split("/").pop().replace(/\.\w+$/, "");
  }

  if (protocol === "new-file:") {
    return "NEW FILE";
  }

  return uri;
}

PaneEditor.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  tabs: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  return state.editor;
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaneEditor);
