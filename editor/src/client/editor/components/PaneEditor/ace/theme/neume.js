import brace from "brace";

brace.define("ace/theme/neume", [ "require", "exports", "module", "ace/lib/dom" ], (acequire, exports) => {
  exports.isDark = true;
  exports.cssClass = "ace-neume";
  exports.cssText = `
.ace-neume .ace_gutter {
  background: #000;
  border-right: solid 1px #333;
}

.ace-neume .ace_gutter-cell {
  color: #666;
}

.ace-neume .ace_print-margin {
  width: 1px;
  background: #333;
}

.ace-neume {
  background-color: #000;
  color: #d4d4d4
}

.ace-neume .ace_cursor {
  color: #a7a7a7;
}

.ace-neume .ace_marker-layer .ace_selection {
  background: #253b76
}

.ace-neume.ace_multiselect .ace_selection.ace_start {
  box-shadow: 0 0 3px 0px #272822;
}

.ace-neume .ace_marker-layer .ace_step {
  background: rgb(102, 82, 0);
}

.ace-neume .ace_marker-layer .ace_bracket {
  outline: 1px solid grey;
  color: white !important;
}

.ace-neume .ace_marker-layer .ace_active-line {
  background: rgba(37, 59, 118, 0.4);
}

.ace-neume .ace_gutter-active-line {
  background: rgba(37, 59, 118, 0.4);
}

.ace-neume .ace_marker-layer .ace_selected-word {
  border: 1px solid #253b76;
}

.ace-neume .ace_invisible {
  color: #52524d;
}

.ace-neume .ace_identifier {
  color: #9cdcfe;
}

.ace-neume .ace_entity.ace_name.ace_tag,
.ace-neume .ace_meta.ace_tag {
  color: #6796e6;
}

.ace-neume .ace_keyword {
  color: #569cd6;
  color: #c586c0;
}

.ace-neume .ace_operator {
  color: #d4d4d4;
}

.ace-neume .ace_punctuation,
.ace-neume .ace_punctuation.ace_tag {
  color: #d4d4d4;
}

.ace-neume .ace_constant.ace_character,
.ace-neume .ace_constant.ace_numeric,
.ace-neume .ace_constant.ace_other {
  color: #b5cea8;
}

.ace-neume .ace_constant.ace_language {
  color: #6796e6;
}

.ace-neume .ace_invalid {
  color: #F8F8F0;
  background-color: #F92672
}

.ace-neume .ace_invalid.ace_deprecated {
  color: #F8F8F0;
  background-color: #AE81FF
}

.ace-neume .ace_support.ace_constant,
.ace-neume .ace_support.ace_function {
  color: #dcdcaa;
}

.ace-neume .ace_fold {
  background-color: #A6E22E;
  border-color: #F8F8F2
}

.ace-neume .ace_storage.ace_type,
.ace-neume .ace_support.ace_class,
.ace-neume .ace_support.ace_type {
  color: #6796e6
}

.ace-neume .ace_entity.ace_name.ace_function,
.ace-neume .ace_entity.ace_other,
.ace-neume .ace_entity.ace_other.ace_attribute-name,
.ace-neume .ace_variable {
  color: #dcdcaa;
}

.ace-neume .ace_variable.ace_parameter {
  color: #9cdcfe;
}

.ace-neume .ace_string {
  color: #ce9178;
}

.ace-neume .ace_regexp {
  color: #d16969;
}

.ace-neume .ace_comment {
  color: #7ca668;
}

.ace-neume .ace_flash {
  position: absolute;
  z-index: 100;
  background: rgba(255, 255, 255, 0.5);
}
`;

  const dom = acequire("../lib/dom");
  dom.importCssString(exports.cssText, exports.cssClass);
});
