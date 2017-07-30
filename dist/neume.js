(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.neume = {})));
}(this, (function (exports) { 'use strict';

var indexBrowser = () => {};

exports['default'] = indexBrowser;

Object.defineProperty(exports, '__esModule', { value: true });

})));
