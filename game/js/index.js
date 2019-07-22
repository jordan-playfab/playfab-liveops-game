/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"index": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./source/index.tsx","vendors"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./source/app/app.tsx":
/*!****************************!*\
  !*** ./source/app/app.tsx ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst React = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\nconst router_1 = __webpack_require__(/*! ./router */ \"./source/app/router.tsx\");\nclass App extends React.Component {\n    constructor() {\n        super(undefined);\n        this.saveTitleID = (titleID) => {\n            this.setState({\n                titleID,\n            });\n        };\n        this.state = {\n            titleID: null,\n        };\n    }\n    render() {\n        return (React.createElement(router_1.Router, { titleID: this.state.titleID, saveTitleID: this.saveTitleID }));\n    }\n}\nexports.default = App;\n\n\n//# sourceURL=webpack:///./source/app/app.tsx?");

/***/ }),

/***/ "./source/app/pages/home.tsx":
/*!***********************************!*\
  !*** ./source/app/pages/home.tsx ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst React = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\nconst TextField_1 = __webpack_require__(/*! office-ui-fabric-react/lib/TextField */ \"./node_modules/office-ui-fabric-react/lib/TextField.js\");\nconst office_ui_fabric_react_1 = __webpack_require__(/*! office-ui-fabric-react */ \"./node_modules/office-ui-fabric-react/lib/index.js\");\nconst is_1 = __webpack_require__(/*! ../shared/is */ \"./source/app/shared/is.ts\");\nconst react_router_dom_1 = __webpack_require__(/*! react-router-dom */ \"./node_modules/react-router-dom/esm/react-router-dom.js\");\nconst routes_1 = __webpack_require__(/*! ../routes */ \"./source/app/routes.ts\");\nclass Home extends React.Component {\n    constructor() {\n        super(undefined);\n        this.saveTitleId = (_, newValue) => {\n            this.setState({\n                titleID: newValue,\n            });\n        };\n        this.saveHasTitleId = () => {\n            this.props.saveTitleID(this.state.titleID);\n        };\n        this.changeTitleId = () => {\n            this.props.saveTitleID(null);\n        };\n        this.state = {\n            titleID: null,\n        };\n    }\n    render() {\n        return (React.createElement(React.Fragment, null,\n            React.createElement(\"h1\", null, \"Home page\"),\n            is_1.is.null(this.props.titleID)\n                ? this.renderAskForTitleID()\n                : this.renderShowTitleID()));\n    }\n    renderAskForTitleID() {\n        return (React.createElement(\"form\", null,\n            React.createElement(\"fieldset\", null,\n                React.createElement(\"legend\", null, \"Title ID\"),\n                React.createElement(TextField_1.TextField, { label: \"PlayFab title ID\", onChange: this.saveTitleId }),\n                React.createElement(office_ui_fabric_react_1.PrimaryButton, { text: \"Save\", onClick: this.saveHasTitleId }))));\n    }\n    renderShowTitleID() {\n        return (React.createElement(React.Fragment, null,\n            React.createElement(\"p\", null,\n                React.createElement(\"strong\", null, \"Your title ID is:\"),\n                \" \",\n                this.props.titleID,\n                React.createElement(\"button\", { onClick: this.changeTitleId }, \"Change\")),\n            React.createElement(\"ul\", null,\n                React.createElement(\"li\", null,\n                    React.createElement(react_router_dom_1.Link, { to: routes_1.routes.TitleData }, \"Load Title Data\")),\n                React.createElement(\"li\", null,\n                    React.createElement(react_router_dom_1.Link, { to: routes_1.routes.Player }, \"Player selection\")))));\n    }\n}\nexports.default = Home;\n\n\n//# sourceURL=webpack:///./source/app/pages/home.tsx?");

/***/ }),

/***/ "./source/app/pages/not-found.tsx":
/*!****************************************!*\
  !*** ./source/app/pages/not-found.tsx ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst React = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\nclass NotFound extends React.Component {\n    render() {\n        return (React.createElement(\"p\", null, \"Page not found. Sorry! Go back to the root?\"));\n    }\n}\nexports.default = NotFound;\n\n\n//# sourceURL=webpack:///./source/app/pages/not-found.tsx?");

/***/ }),

/***/ "./source/app/pages/player.tsx":
/*!*************************************!*\
  !*** ./source/app/pages/player.tsx ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst React = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\nconst is_1 = __webpack_require__(/*! ../shared/is */ \"./source/app/shared/is.ts\");\nconst react_router_1 = __webpack_require__(/*! react-router */ \"./node_modules/react-router/esm/react-router.js\");\nconst routes_1 = __webpack_require__(/*! ../routes */ \"./source/app/routes.ts\");\nclass Player extends React.Component {\n    render() {\n        if (is_1.is.null(this.props.titleID)) {\n            return React.createElement(react_router_1.Redirect, { to: routes_1.routes.Home });\n        }\n        return (React.createElement(React.Fragment, null,\n            React.createElement(\"h1\", null, \"Player\"),\n            React.createElement(\"p\", null,\n                \"Your title ID is \",\n                this.props.titleID),\n            React.createElement(\"p\", null, \"This page will let you login a player using Custom ID.\"),\n            React.createElement(\"p\", null, \"This page hasn't been built yet.\")));\n    }\n}\nexports.default = Player;\n\n\n//# sourceURL=webpack:///./source/app/pages/player.tsx?");

/***/ }),

/***/ "./source/app/pages/title-data.tsx":
/*!*****************************************!*\
  !*** ./source/app/pages/title-data.tsx ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst React = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\nconst is_1 = __webpack_require__(/*! ../shared/is */ \"./source/app/shared/is.ts\");\nconst react_router_1 = __webpack_require__(/*! react-router */ \"./node_modules/react-router/esm/react-router.js\");\nconst routes_1 = __webpack_require__(/*! ../routes */ \"./source/app/routes.ts\");\nclass TitleData extends React.Component {\n    render() {\n        if (is_1.is.null(this.props.titleID)) {\n            return React.createElement(react_router_1.Redirect, { to: routes_1.routes.Home });\n        }\n        return (React.createElement(React.Fragment, null,\n            React.createElement(\"h1\", null, \"Title Data\"),\n            React.createElement(\"p\", null,\n                \"Your title ID is \",\n                this.props.titleID),\n            React.createElement(\"p\", null, \"This page will help you load the required title data into your title.\"),\n            React.createElement(\"p\", null, \"This page hasn't been built yet.\")));\n    }\n}\nexports.default = TitleData;\n\n\n//# sourceURL=webpack:///./source/app/pages/title-data.tsx?");

/***/ }),

/***/ "./source/app/router.tsx":
/*!*******************************!*\
  !*** ./source/app/router.tsx ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst React = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\nconst react_router_dom_1 = __webpack_require__(/*! react-router-dom */ \"./node_modules/react-router-dom/esm/react-router-dom.js\");\nconst routes_1 = __webpack_require__(/*! ./routes */ \"./source/app/routes.ts\");\nconst home_1 = __webpack_require__(/*! ./pages/home */ \"./source/app/pages/home.tsx\");\nconst title_data_1 = __webpack_require__(/*! ./pages/title-data */ \"./source/app/pages/title-data.tsx\");\nconst player_1 = __webpack_require__(/*! ./pages/player */ \"./source/app/pages/player.tsx\");\nconst not_found_1 = __webpack_require__(/*! ./pages/not-found */ \"./source/app/pages/not-found.tsx\");\nclass Router extends React.Component {\n    render() {\n        return (React.createElement(react_router_dom_1.HashRouter, null,\n            React.createElement(react_router_dom_1.Switch, null,\n                React.createElement(react_router_dom_1.Route, { exact: true, path: routes_1.routes.Home, render: (props) => React.createElement(home_1.default, Object.assign({}, props, this.props)) }),\n                React.createElement(react_router_dom_1.Route, { exact: true, path: routes_1.routes.TitleData, render: (props) => React.createElement(title_data_1.default, Object.assign({}, props, this.props)) }),\n                React.createElement(react_router_dom_1.Route, { exact: true, path: routes_1.routes.Player, render: (props) => React.createElement(player_1.default, Object.assign({}, props, this.props)) }),\n                React.createElement(react_router_dom_1.Route, { component: not_found_1.default }))));\n    }\n}\nexports.Router = Router;\n;\n\n\n//# sourceURL=webpack:///./source/app/router.tsx?");

/***/ }),

/***/ "./source/app/routes.ts":
/*!******************************!*\
  !*** ./source/app/routes.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.routes = {\n    Home: \"/\",\n    TitleData: \"/title-data\",\n    Player: \"/player\"\n};\n\n\n//# sourceURL=webpack:///./source/app/routes.ts?");

/***/ }),

/***/ "./source/app/shared/is.ts":
/*!*********************************!*\
  !*** ./source/app/shared/is.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nfunction IsArray(data) {\n    if (data === null || typeof data === \"undefined\") {\n        return false;\n    }\n    return data.constructor === Array;\n}\nfunction IsNull(data) {\n    return typeof data === \"undefined\"\n        || data === null\n        || (typeof data === \"string\" && data.length === 0)\n        || (IsArray(data) && data.length === 0);\n}\nfunction IsDate(data) {\n    return data instanceof Date;\n}\nfunction IsDateString(data) {\n    return !IsNull(data) && data.indexOf(\"/Date(\") === 0;\n}\nfunction IsJsonString(data) {\n    try {\n        JSON.parse(data);\n        return true;\n    }\n    catch (_a) {\n        return false;\n    }\n}\nfunction IsNumeric(data) {\n    return typeof data !== \"undefined\"\n        && data !== null\n        && (data.toString().length > 0\n            && data.toString().replace(/[\\d\\.]+/gi, \"\").length === 0\n            && !isNaN(data));\n}\nfunction IsString(data) {\n    return !IsNull(data) && typeof data === \"string\";\n}\nfunction IsValidHttpUrl(data) {\n    // Copyright (c) 2010-2013 Diego Perini, MIT licensed\n    // https://gist.github.com/dperini/729294\n    // see also https://mathiasbynens.be/demo/url-regex\n    // modified to allow protocol-relative URLs\n    // and modified again to remove ftp (Jordan)\n    if (IsNull(data)) {\n        return false;\n    }\n    const validUrlRegex = /^(?:(?:(?:https?):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})).?)(?::\\d{2,5})?(?:[/?#]\\S*)?$/i;\n    return validUrlRegex.test(data);\n}\nfunction IsFunction(data) {\n    return !IsNull(data) && data instanceof Function;\n}\nconst IsReactRoute = (uri) => {\n    const reactRouteRegex = /[a-z]{1,4}\\-[a-z]{1,4}\\/r\\/[ts]\\//gi;\n    return !IsNull(uri) && reactRouteRegex.test(uri);\n};\nconst IsArrayDifferent = (array1, array2, useDeepComparison = false) => {\n    const isArray1Null = IsNull(array1);\n    const isArray2Null = IsNull(array2);\n    if (isArray1Null && isArray2Null) {\n        return false;\n    }\n    const shallowResult = isArray1Null !== isArray2Null\n        || (!isArray1Null && !isArray2Null && array1.length !== array2.length);\n    if (shallowResult) {\n        return true;\n    }\n    if (!useDeepComparison) {\n        return array1 !== array2;\n    }\n    return array1.some((array1Item, index) => {\n        return array2[index] !== array1Item;\n    });\n};\nconst IsInArray = (array, element) => {\n    return !IsNull(array) && array.indexOf(element) !== -1;\n};\nconst IsShallowEqual = (obj1, obj2, ignorePrivateProperties = false) => {\n    if (exports.is.null(obj1) && exports.is.null(obj2)) {\n        return true;\n    }\n    else if (exports.is.null(obj1) !== exports.is.null(obj2)) {\n        return false;\n    }\n    else if (typeof (obj1) !== \"object\" && typeof (obj2) !== \"object\") {\n        return obj1 === obj2;\n    }\n    for (const p in obj1) {\n        if (ignorePrivateProperties && p.startsWith(\"_\")) {\n            continue;\n        }\n        if (obj1.hasOwnProperty(p)) {\n            if (obj1[p] !== obj2[p]) {\n                return false;\n            }\n        }\n    }\n    for (const p in obj2) {\n        if (ignorePrivateProperties && p.startsWith(\"_\")) {\n            continue;\n        }\n        if (obj2.hasOwnProperty(p)) {\n            if (obj1[p] !== obj2[p]) {\n                return false;\n            }\n        }\n    }\n    return true;\n};\nconst IsAnythingDifferent = (props, nextProps, ...keys) => {\n    return keys.some((key) => {\n        if (IsArray(props[key])) {\n            return IsArrayDifferent(props[key], nextProps[key], true);\n        }\n        return props[key] !== nextProps[key];\n    });\n};\nexports.is = {\n    array: IsArray,\n    arrayDifferent: IsArrayDifferent,\n    null: IsNull,\n    date: IsDate,\n    dateString: IsDateString,\n    numeric: IsNumeric,\n    string: IsString,\n    validHttpUrl: IsValidHttpUrl,\n    function: IsFunction,\n    reactRoute: IsReactRoute,\n    jsonString: IsJsonString,\n    inArray: IsInArray,\n    shallowEqual: IsShallowEqual,\n    anythingDifferent: IsAnythingDifferent,\n};\n\n\n//# sourceURL=webpack:///./source/app/shared/is.ts?");

/***/ }),

/***/ "./source/index.tsx":
/*!**************************!*\
  !*** ./source/index.tsx ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst React = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\nconst react_dom_1 = __webpack_require__(/*! react-dom */ \"./node_modules/react-dom/index.js\");\nconst app_1 = __webpack_require__(/*! ./app/app */ \"./source/app/app.tsx\");\nreact_dom_1.render(React.createElement(app_1.default, null), document.getElementById(\"app\"));\n\n\n//# sourceURL=webpack:///./source/index.tsx?");

/***/ })

/******/ });