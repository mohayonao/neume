(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.neume = global.neume || {})));
}(this, (function (exports) { 'use strict';

function neume() {}

exports['default'] = neume;

Object.defineProperty(exports, '__esModule', { value: true });

})));
