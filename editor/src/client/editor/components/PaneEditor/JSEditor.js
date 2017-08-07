import React, { Component } from "react";
import PropTypes from "prop-types";
import AceEditor from "react-ace";
import ace from "brace";

import "brace/mode/javascript";
import "./ace/theme/neume";

class JSEditor extends Component {
  constructor(props) {
    super(props);

    this._editor = null;
    this._session = null;
    this._dummyUndoManager = new ace.UndoManager();
    this._undoManagers = {};
    this._onLoad = this._onLoad.bind(this);
  }

  _onLoad(editor) {
    const { tabId, content } = this.props;

    this._editor = editor;
    this._session = editor.getSession();
    this._session.setValue(content);
    this._undoManagers[tabId] = this._session.getUndoManager();

    fixKeyBindings(editor);
  }

  shouldComponentUpdate(nextProps) {
    const { tabId, content } = nextProps;

    if (this.props.tabId !== tabId) {
      if (!this._undoManagers.hasOwnProperty(tabId)) {
        this._undoManagers[tabId] = new ace.UndoManager();
        this._session.setValue(content);
      } else {
        this._session.setUndoManager(this._dummyUndoManager);
        this._session.setValue(content);
        this._session.setUndoManager(this._undoManagers[tabId]);
        this._editor.focus();
      }
    }

    return false;
  }

  render() {
    const { editorProps } = this.props;
    const props = Object.assign({}, JSEditor.defaultProps, editorProps);

    return (
      <AceEditor onLoad={ this._onLoad } { ...props } />
    );
  }
}

JSEditor.defaultProps = {
  mode: "javascript",
  theme: "neume",
  width: "100%",
  height: "100%",
  fontSize: 12,
  showPrintMargin: false,
  highlightActiveLine: false,
  tabSize: 2,
  editorProps: { $blockScrolling: true },
};

JSEditor.propTypes = {
  editorProps: PropTypes.object.isRequired,
  tabId: PropTypes.number.isRequired,
  content: PropTypes.string,
};

function fixKeyBindings(editor) {
  // https://github.com/ajaxorg/ace/issues/2286
  editor.commands.bindKey({ mac: "Ctrl-P" }, "golineup");
}

export default JSEditor;
