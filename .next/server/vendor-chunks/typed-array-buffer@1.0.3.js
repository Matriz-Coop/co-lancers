"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/typed-array-buffer@1.0.3";
exports.ids = ["vendor-chunks/typed-array-buffer@1.0.3"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/typed-array-buffer@1.0.3/node_modules/typed-array-buffer/index.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/.pnpm/typed-array-buffer@1.0.3/node_modules/typed-array-buffer/index.js ***!
  \**********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar $TypeError = __webpack_require__(/*! es-errors/type */ \"(ssr)/./node_modules/.pnpm/es-errors@1.3.0/node_modules/es-errors/type.js\");\n\nvar callBound = __webpack_require__(/*! call-bound */ \"(ssr)/./node_modules/.pnpm/call-bound@1.0.4/node_modules/call-bound/index.js\");\n\n/** @type {undefined | ((thisArg: import('.').TypedArray) => Buffer<ArrayBufferLike>)} */\nvar $typedArrayBuffer = callBound('TypedArray.prototype.buffer', true);\n\nvar isTypedArray = __webpack_require__(/*! is-typed-array */ \"(ssr)/./node_modules/.pnpm/is-typed-array@1.1.15/node_modules/is-typed-array/index.js\");\n\n/** @type {import('.')} */\n// node <= 0.10, < 0.11.4 has a nonconfigurable own property instead of a prototype getter\nmodule.exports = $typedArrayBuffer || function typedArrayBuffer(x) {\n\tif (!isTypedArray(x)) {\n\t\tthrow new $TypeError('Not a Typed Array');\n\t}\n\treturn x.buffer;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vdHlwZWQtYXJyYXktYnVmZmVyQDEuMC4zL25vZGVfbW9kdWxlcy90eXBlZC1hcnJheS1idWZmZXIvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWIsaUJBQWlCLG1CQUFPLENBQUMsaUdBQWdCOztBQUV6QyxnQkFBZ0IsbUJBQU8sQ0FBQyxnR0FBWTs7QUFFcEMsV0FBVyw0RUFBNEU7QUFDdkY7O0FBRUEsbUJBQW1CLG1CQUFPLENBQUMsNkdBQWdCOztBQUUzQyxXQUFXLGFBQWE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIi9ob21lL21lbGlzc2EvZXRoZ2xvYmFsMjAyNS9jby1sYW5jZXJzL25vZGVfbW9kdWxlcy8ucG5wbS90eXBlZC1hcnJheS1idWZmZXJAMS4wLjMvbm9kZV9tb2R1bGVzL3R5cGVkLWFycmF5LWJ1ZmZlci9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciAkVHlwZUVycm9yID0gcmVxdWlyZSgnZXMtZXJyb3JzL3R5cGUnKTtcblxudmFyIGNhbGxCb3VuZCA9IHJlcXVpcmUoJ2NhbGwtYm91bmQnKTtcblxuLyoqIEB0eXBlIHt1bmRlZmluZWQgfCAoKHRoaXNBcmc6IGltcG9ydCgnLicpLlR5cGVkQXJyYXkpID0+IEJ1ZmZlcjxBcnJheUJ1ZmZlckxpa2U+KX0gKi9cbnZhciAkdHlwZWRBcnJheUJ1ZmZlciA9IGNhbGxCb3VuZCgnVHlwZWRBcnJheS5wcm90b3R5cGUuYnVmZmVyJywgdHJ1ZSk7XG5cbnZhciBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCdpcy10eXBlZC1hcnJheScpO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLicpfSAqL1xuLy8gbm9kZSA8PSAwLjEwLCA8IDAuMTEuNCBoYXMgYSBub25jb25maWd1cmFibGUgb3duIHByb3BlcnR5IGluc3RlYWQgb2YgYSBwcm90b3R5cGUgZ2V0dGVyXG5tb2R1bGUuZXhwb3J0cyA9ICR0eXBlZEFycmF5QnVmZmVyIHx8IGZ1bmN0aW9uIHR5cGVkQXJyYXlCdWZmZXIoeCkge1xuXHRpZiAoIWlzVHlwZWRBcnJheSh4KSkge1xuXHRcdHRocm93IG5ldyAkVHlwZUVycm9yKCdOb3QgYSBUeXBlZCBBcnJheScpO1xuXHR9XG5cdHJldHVybiB4LmJ1ZmZlcjtcbn07XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/typed-array-buffer@1.0.3/node_modules/typed-array-buffer/index.js\n");

/***/ })

};
;