module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "JkW7");
/******/ })
/************************************************************************/
/******/ ({

/***/ "/QC5":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subscribers", function() { return subscribers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrentUrl", function() { return getCurrentUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "route", function() { return route; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Router", function() { return Router; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Route", function() { return Route; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Link", function() { return Link; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact__ = __webpack_require__("KM04");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_preact__);


var EMPTY$1 = {};

function assign(obj, props) {
	// eslint-disable-next-line guard-for-in
	for (var i in props) {
		obj[i] = props[i];
	}
	return obj;
}

function exec(url, route, opts) {
	var reg = /(?:\?([^#]*))?(#.*)?$/,
	    c = url.match(reg),
	    matches = {},
	    ret;
	if (c && c[1]) {
		var p = c[1].split('&');
		for (var i = 0; i < p.length; i++) {
			var r = p[i].split('=');
			matches[decodeURIComponent(r[0])] = decodeURIComponent(r.slice(1).join('='));
		}
	}
	url = segmentize(url.replace(reg, ''));
	route = segmentize(route || '');
	var max = Math.max(url.length, route.length);
	for (var i$1 = 0; i$1 < max; i$1++) {
		if (route[i$1] && route[i$1].charAt(0) === ':') {
			var param = route[i$1].replace(/(^\:|[+*?]+$)/g, ''),
			    flags = (route[i$1].match(/[+*?]+$/) || EMPTY$1)[0] || '',
			    plus = ~flags.indexOf('+'),
			    star = ~flags.indexOf('*'),
			    val = url[i$1] || '';
			if (!val && !star && (flags.indexOf('?') < 0 || plus)) {
				ret = false;
				break;
			}
			matches[param] = decodeURIComponent(val);
			if (plus || star) {
				matches[param] = url.slice(i$1).map(decodeURIComponent).join('/');
				break;
			}
		} else if (route[i$1] !== url[i$1]) {
			ret = false;
			break;
		}
	}
	if (opts.default !== true && ret === false) {
		return false;
	}
	return matches;
}

function pathRankSort(a, b) {
	return a.rank < b.rank ? 1 : a.rank > b.rank ? -1 : a.index - b.index;
}

// filter out VNodes without attributes (which are unrankeable), and add `index`/`rank` properties to be used in sorting.
function prepareVNodeForRanking(vnode, index) {
	vnode.index = index;
	vnode.rank = rankChild(vnode);
	return vnode.attributes;
}

function segmentize(url) {
	return url.replace(/(^\/+|\/+$)/g, '').split('/');
}

function rankSegment(segment) {
	return segment.charAt(0) == ':' ? 1 + '*+?'.indexOf(segment.charAt(segment.length - 1)) || 4 : 5;
}

function rank(path) {
	return segmentize(path).map(rankSegment).join('');
}

function rankChild(vnode) {
	return vnode.attributes.default ? 0 : rank(vnode.attributes.path);
}

var customHistory = null;

var ROUTERS = [];

var subscribers = [];

var EMPTY = {};

function isPreactElement(node) {
	return node.__preactattr_ != null || typeof Symbol !== 'undefined' && node[Symbol.for('preactattr')] != null;
}

function setUrl(url, type) {
	if (type === void 0) type = 'push';

	if (customHistory && customHistory[type]) {
		customHistory[type](url);
	} else if (typeof history !== 'undefined' && history[type + 'State']) {
		history[type + 'State'](null, null, url);
	}
}

function getCurrentUrl() {
	var url;
	if (customHistory && customHistory.location) {
		url = customHistory.location;
	} else if (customHistory && customHistory.getCurrentLocation) {
		url = customHistory.getCurrentLocation();
	} else {
		url = typeof location !== 'undefined' ? location : EMPTY;
	}
	return "" + (url.pathname || '') + (url.search || '');
}

function route(url, replace) {
	if (replace === void 0) replace = false;

	if (typeof url !== 'string' && url.url) {
		replace = url.replace;
		url = url.url;
	}

	// only push URL into history if we can handle it
	if (canRoute(url)) {
		setUrl(url, replace ? 'replace' : 'push');
	}

	return routeTo(url);
}

/** Check if the given URL can be handled by any router instances. */
function canRoute(url) {
	for (var i = ROUTERS.length; i--;) {
		if (ROUTERS[i].canRoute(url)) {
			return true;
		}
	}
	return false;
}

/** Tell all router instances to handle the given URL.  */
function routeTo(url) {
	var didRoute = false;
	for (var i = 0; i < ROUTERS.length; i++) {
		if (ROUTERS[i].routeTo(url) === true) {
			didRoute = true;
		}
	}
	for (var i$1 = subscribers.length; i$1--;) {
		subscribers[i$1](url);
	}
	return didRoute;
}

function routeFromLink(node) {
	// only valid elements
	if (!node || !node.getAttribute) {
		return;
	}

	var href = node.getAttribute('href'),
	    target = node.getAttribute('target');

	// ignore links with targets and non-path URLs
	if (!href || !href.match(/^\//g) || target && !target.match(/^_?self$/i)) {
		return;
	}

	// attempt to route, if no match simply cede control to browser
	return route(href);
}

function handleLinkClick(e) {
	if (e.button == 0) {
		routeFromLink(e.currentTarget || e.target || this);
		return prevent(e);
	}
}

function prevent(e) {
	if (e) {
		if (e.stopImmediatePropagation) {
			e.stopImmediatePropagation();
		}
		if (e.stopPropagation) {
			e.stopPropagation();
		}
		e.preventDefault();
	}
	return false;
}

function delegateLinkHandler(e) {
	// ignore events the browser takes care of already:
	if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button !== 0) {
		return;
	}

	var t = e.target;
	do {
		if (String(t.nodeName).toUpperCase() === 'A' && t.getAttribute('href') && isPreactElement(t)) {
			if (t.hasAttribute('native')) {
				return;
			}
			// if link is handled by the router, prevent browser defaults
			if (routeFromLink(t)) {
				return prevent(e);
			}
		}
	} while (t = t.parentNode);
}

var eventListenersInitialized = false;

function initEventListeners() {
	if (eventListenersInitialized) {
		return;
	}

	if (typeof addEventListener === 'function') {
		if (!customHistory) {
			addEventListener('popstate', function () {
				routeTo(getCurrentUrl());
			});
		}
		addEventListener('click', delegateLinkHandler);
	}
	eventListenersInitialized = true;
}

var Router = function (Component$$1) {
	function Router(props) {
		Component$$1.call(this, props);
		if (props.history) {
			customHistory = props.history;
		}

		this.state = {
			url: props.url || getCurrentUrl()
		};

		initEventListeners();
	}

	if (Component$$1) Router.__proto__ = Component$$1;
	Router.prototype = Object.create(Component$$1 && Component$$1.prototype);
	Router.prototype.constructor = Router;

	Router.prototype.shouldComponentUpdate = function shouldComponentUpdate(props) {
		if (props.static !== true) {
			return true;
		}
		return props.url !== this.props.url || props.onChange !== this.props.onChange;
	};

	/** Check if the given URL can be matched against any children */
	Router.prototype.canRoute = function canRoute(url) {
		return this.getMatchingChildren(this.props.children, url, false).length > 0;
	};

	/** Re-render children with a new URL to match against. */
	Router.prototype.routeTo = function routeTo(url) {
		this._didRoute = false;
		this.setState({ url: url });

		// if we're in the middle of an update, don't synchronously re-route.
		if (this.updating) {
			return this.canRoute(url);
		}

		this.forceUpdate();
		return this._didRoute;
	};

	Router.prototype.componentWillMount = function componentWillMount() {
		ROUTERS.push(this);
		this.updating = true;
	};

	Router.prototype.componentDidMount = function componentDidMount() {
		var this$1 = this;

		if (customHistory) {
			this.unlisten = customHistory.listen(function (location) {
				this$1.routeTo("" + (location.pathname || '') + (location.search || ''));
			});
		}
		this.updating = false;
	};

	Router.prototype.componentWillUnmount = function componentWillUnmount() {
		if (typeof this.unlisten === 'function') {
			this.unlisten();
		}
		ROUTERS.splice(ROUTERS.indexOf(this), 1);
	};

	Router.prototype.componentWillUpdate = function componentWillUpdate() {
		this.updating = true;
	};

	Router.prototype.componentDidUpdate = function componentDidUpdate() {
		this.updating = false;
	};

	Router.prototype.getMatchingChildren = function getMatchingChildren(children, url, invoke) {
		return children.filter(prepareVNodeForRanking).sort(pathRankSort).map(function (vnode) {
			var matches = exec(url, vnode.attributes.path, vnode.attributes);
			if (matches) {
				if (invoke !== false) {
					var newProps = { url: url, matches: matches };
					assign(newProps, matches);
					delete newProps.ref;
					delete newProps.key;
					return Object(__WEBPACK_IMPORTED_MODULE_0_preact__["cloneElement"])(vnode, newProps);
				}
				return vnode;
			}
		}).filter(Boolean);
	};

	Router.prototype.render = function render(ref, ref$1) {
		var children = ref.children;
		var onChange = ref.onChange;
		var url = ref$1.url;

		var active = this.getMatchingChildren(children, url, true);

		var current = active[0] || null;
		this._didRoute = !!current;

		var previous = this.previousUrl;
		if (url !== previous) {
			this.previousUrl = url;
			if (typeof onChange === 'function') {
				onChange({
					router: this,
					url: url,
					previous: previous,
					active: active,
					current: current
				});
			}
		}

		return current;
	};

	return Router;
}(__WEBPACK_IMPORTED_MODULE_0_preact__["Component"]);

var Link = function Link(props) {
	return Object(__WEBPACK_IMPORTED_MODULE_0_preact__["h"])('a', assign({ onClick: handleLinkClick }, props));
};

var Route = function Route(props) {
	return Object(__WEBPACK_IMPORTED_MODULE_0_preact__["h"])(props.component, props);
};

Router.subscribers = subscribers;
Router.getCurrentUrl = getCurrentUrl;
Router.route = route;
Router.Router = Router;
Router.Route = Route;
Router.Link = Link;

/* harmony default export */ __webpack_exports__["default"] = (Router);
//# sourceMappingURL=preact-router.es.js.map

/***/ }),

/***/ "/w7L":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("S1cf");

module.exports = utils.isStandardBrowserEnv() ?

// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
function standardBrowserEnv() {
  var msie = /(msie|trident)/i.test(navigator.userAgent);
  var urlParsingNode = document.createElement('a');
  var originURL;

  /**
  * Parse a URL to discover it's components
  *
  * @param {String} url The URL to be parsed
  * @returns {Object}
  */
  function resolveURL(url) {
    var href = url;

    if (msie) {
      // IE needs attribute set twice to normalize properties
      urlParsingNode.setAttribute('href', href);
      href = urlParsingNode.href;
    }

    urlParsingNode.setAttribute('href', href);

    // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
    return {
      href: urlParsingNode.href,
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
      host: urlParsingNode.host,
      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
      hostname: urlParsingNode.hostname,
      port: urlParsingNode.port,
      pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
    };
  }

  originURL = resolveURL(window.location.href);

  /**
  * Determine if a URL shares the same origin as the current location
  *
  * @param {String} requestURL The URL to test
  * @returns {boolean} True if URL shares the same origin, otherwise false
  */
  return function isURLSameOrigin(requestURL) {
    var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
    return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
  };
}() :

// Non standard browser envs (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
  return function isURLSameOrigin() {
    return true;
  };
}();

/***/ }),

/***/ "0wwn":
/***/ (function(module, exports) {

module.exports = { prefix: 'fas', iconName: 'plus', icon: [448, 512, [], "f067", "M448 294.2v-76.4c0-13.3-10.7-24-24-24H286.2V56c0-13.3-10.7-24-24-24h-76.4c-13.3 0-24 10.7-24 24v137.8H24c-13.3 0-24 10.7-24 24v76.4c0 13.3 10.7 24 24 24h137.8V456c0 13.3 10.7 24 24 24h76.4c13.3 0 24-10.7 24-24V318.2H424c13.3 0 24-10.7 24-24z"] };

/***/ }),

/***/ "3JCP":
/***/ (function(module, exports, __webpack_require__) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var url = __webpack_require__("Vy1O");
var http = __webpack_require__("gHkb");
var https = __webpack_require__("XgVs");
var assert = __webpack_require__("5E5G");
var Writable = __webpack_require__("97RM").Writable;
var debug = __webpack_require__("8NLT")("follow-redirects");

// RFC7231§4.2.1: Of the request methods defined by this specification,
// the GET, HEAD, OPTIONS, and TRACE methods are defined to be safe.
var SAFE_METHODS = { GET: true, HEAD: true, OPTIONS: true, TRACE: true };

// Create handlers that pass events from native requests
var eventHandlers = Object.create(null);
["abort", "aborted", "error", "socket", "timeout"].forEach(function (event) {
  eventHandlers[event] = function (arg) {
    this._redirectable.emit(event, arg);
  };
});

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
  // Initialize the request
  Writable.call(this);
  options.headers = options.headers || {};
  this._options = options;
  this._redirectCount = 0;
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];

  // Attach a callback if passed
  if (responseCallback) {
    this.on("response", responseCallback);
  }

  // React to responses of native requests
  var self = this;
  this._onNativeResponse = function (response) {
    self._processResponse(response);
  };

  // Complete the URL object when necessary
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    } else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }

  // Perform the first request
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data: data, encoding: encoding });
    this._currentRequest.write(data, encoding, callback);
  } else {
    this.emit("error", new Error("Request body larger than maxBodyLength limit"));
    this.abort();
  }
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
  var currentRequest = this._currentRequest;
  if (!data) {
    currentRequest.end(null, null, callback);
  } else {
    this.write(data, encoding, function () {
      currentRequest.end(null, null, callback);
    });
  }
};

// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};

// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function (name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};

// Proxy all other public ClientRequest methods
["abort", "flushHeaders", "getHeader", "setNoDelay", "setSocketKeepAlive", "setTimeout"].forEach(function (method) {
  RedirectableRequest.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
});

// Proxy all public ClientRequest properties
["aborted", "connection", "socket"].forEach(function (property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function get() {
      return this._currentRequest[property];
    }
  });
});

// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
  // Load the native protocol
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];

  // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)
  if (this._options.agents) {
    var scheme = protocol.substr(0, protocol.length - 1);
    this._options.agent = this._options.agents[scheme];
  }

  // Create the native request
  var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
  this._currentUrl = url.format(this._options);

  // Set up event handlers
  request._redirectable = this;
  for (var event in eventHandlers) {
    /* istanbul ignore else */
    if (event) {
      request.on(event, eventHandlers[event]);
    }
  }

  // End a redirected request
  // (The first request must be ended explicitly with RedirectableRequest#end)
  if (this._isRedirect) {
    // Write the request entity and end.
    var requestBodyBuffers = this._requestBodyBuffers;
    (function writeNext() {
      if (requestBodyBuffers.length !== 0) {
        var buffer = requestBodyBuffers.pop();
        request.write(buffer.data, buffer.encoding, writeNext);
      } else {
        request.end();
      }
    })();
  }
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
  // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
  // that further action needs to be taken by the user agent in order to
  // fulfill the request. If a Location header field is provided,
  // the user agent MAY automatically redirect its request to the URI
  // referenced by the Location field value,
  // even if the specific status code is not understood.
  var location = response.headers.location;
  if (location && this._options.followRedirects !== false && response.statusCode >= 300 && response.statusCode < 400) {
    // RFC7231§6.4: A client SHOULD detect and intervene
    // in cyclical redirections (i.e., "infinite" redirection loops).
    if (++this._redirectCount > this._options.maxRedirects) {
      this.emit("error", new Error("Max redirects exceeded."));
      return;
    }

    // RFC7231§6.4: Automatic redirection needs to done with
    // care for methods not known to be safe […],
    // since the user might not wish to redirect an unsafe request.
    // RFC7231§6.4.7: The 307 (Temporary Redirect) status code indicates
    // that the target resource resides temporarily under a different URI
    // and the user agent MUST NOT change the request method
    // if it performs an automatic redirection to that URI.
    var header;
    var headers = this._options.headers;
    if (response.statusCode !== 307 && !(this._options.method in SAFE_METHODS)) {
      this._options.method = "GET";
      // Drop a possible entity and headers related to it
      this._requestBodyBuffers = [];
      for (header in headers) {
        if (/^content-/i.test(header)) {
          delete headers[header];
        }
      }
    }

    // Drop the Host header, as the redirect might lead to a different host
    if (!this._isRedirect) {
      for (header in headers) {
        if (/^host$/i.test(header)) {
          delete headers[header];
        }
      }
    }

    // Perform the redirected request
    var redirectUrl = url.resolve(this._currentUrl, location);
    debug("redirecting to", redirectUrl);
    _extends(this._options, url.parse(redirectUrl));
    this._isRedirect = true;
    this._performRequest();
  } else {
    // The response is not a redirect; return it as-is
    response.responseUrl = this._currentUrl;
    this.emit("response", response);

    // Clean up
    this._requestBodyBuffers = [];
  }
};

// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
  // Default settings
  var exports = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024
  };

  // Wrap each protocol
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function (scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

    // Executes a request, following redirects
    wrappedProtocol.request = function (options, callback) {
      if (typeof options === "string") {
        options = url.parse(options);
        options.maxRedirects = exports.maxRedirects;
      } else {
        options = _extends({
          protocol: protocol,
          maxRedirects: exports.maxRedirects,
          maxBodyLength: exports.maxBodyLength
        }, options);
      }
      options.nativeProtocols = nativeProtocols;
      assert.equal(options.protocol, protocol, "protocol mismatch");
      debug("options", options);
      return new RedirectableRequest(options, callback);
    };

    // Executes a GET request, following redirects
    wrappedProtocol.get = function (options, callback) {
      var request = wrappedProtocol.request(options, callback);
      request.end();
      return request;
    };
  });
  return exports;
}

// Exports
module.exports = wrap({ http: http, https: https });
module.exports.wrap = wrap;

/***/ }),

/***/ "3bIi":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__("YdsM");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

/***/ }),

/***/ "5D9O":
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (false) {
  var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element') || 0xeac7;

  var isValidElement = function isValidElement(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__("wVGV")();
}

/***/ }),

/***/ "5E5G":
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),

/***/ "60rz":
/***/ (function(module, exports) {

module.exports = { prefix: 'fas', iconName: 'bullhorn', icon: [576, 512, [], "f0a1", "M576 224c0-20.896-13.36-38.666-32-45.258V64c0-35.346-28.654-64-64-64-64.985 56-142.031 128-272 128H48c-26.51 0-48 21.49-48 48v96c0 26.51 21.49 48 48 48h43.263c-18.742 64.65 2.479 116.379 18.814 167.44 1.702 5.32 5.203 9.893 9.922 12.88 20.78 13.155 68.355 15.657 93.773 5.151 16.046-6.633 19.96-27.423 7.522-39.537-18.508-18.026-30.136-36.91-19.795-60.858a12.278 12.278 0 0 0-1.045-11.673c-16.309-24.679-3.581-62.107 28.517-72.752C346.403 327.887 418.591 395.081 480 448c35.346 0 64-28.654 64-64V269.258c18.64-6.592 32-24.362 32-45.258zm-96 139.855c-54.609-44.979-125.033-92.94-224-104.982v-69.747c98.967-12.042 169.391-60.002 224-104.982v279.711z"] };

/***/ }),

/***/ "6IAg":
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') || plural(ms, h, 'hour') || plural(ms, m, 'minute') || plural(ms, s, 'second') || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

/***/ }),

/***/ "7/2Y":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */

module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return (/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
  );
};

/***/ }),

/***/ "8A/K":
/***/ (function(module, exports) {

module.exports = { prefix: 'fas', iconName: 'key', icon: [512, 512, [], "f084", "M512 176.001C512 273.203 433.202 352 336 352c-11.22 0-22.19-1.062-32.827-3.069l-24.012 27.014A23.999 23.999 0 0 1 261.223 384H224v40c0 13.255-10.745 24-24 24h-40v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24v-78.059c0-6.365 2.529-12.47 7.029-16.971l161.802-161.802C163.108 213.814 160 195.271 160 176 160 78.798 238.797.001 335.999 0 433.488-.001 512 78.511 512 176.001zM336 128c0 26.51 21.49 48 48 48s48-21.49 48-48-21.49-48-48-48-48 21.49-48 48z"] };

/***/ }),

/***/ "8NLT":
/***/ (function(module, exports, __webpack_require__) {

/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer') {
  module.exports = __webpack_require__("jcLW");
} else {
  module.exports = __webpack_require__("9WM/");
}

/***/ }),

/***/ "97RM":
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),

/***/ "9WM/":
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var tty = __webpack_require__("Axko");
var util = __webpack_require__("Bcfi");

/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__("y5CM");
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
  var supportsColor = __webpack_require__("DYmO");
  if (supportsColor && supportsColor.level >= 2) {
    exports.colors = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221];
  }
} catch (err) {}
// swallow - we only care if `supports-color` is available; it doesn't have to be.


/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return (/^debug_/i.test(key)
  );
}).reduce(function (obj, key) {
  // camel-case
  var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function (_, k) {
    return k.toUpperCase();
  });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;else if (/^(no|off|false|disabled)$/i.test(val)) val = false;else if (val === 'null') val = null;else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function (v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts).split('\n').map(function (str) {
    return str.trim();
  }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function (v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var colorCode = '\x1B[3' + (c < 8 ? c : '8;5;' + c);
    var prefix = '  ' + colorCode + ';1m' + name + ' ' + '\x1B[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push(colorCode + 'm+' + exports.humanize(this.diff) + '\x1B[0m');
  } else {
    args[0] = getDate() + name + ' ' + args[0];
  }
}

function getDate() {
  if (exports.inspectOpts.hideDate) {
    return '';
  } else {
    return new Date().toISOString() + ' ';
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log() {
  return process.stderr.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());

/***/ }),

/***/ "Asjh":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

/***/ }),

/***/ "Axko":
/***/ (function(module, exports) {

module.exports = require("tty");

/***/ }),

/***/ "BXyq":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("S1cf");
var normalizeHeaderName = __webpack_require__("M8l6");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__("KRuG");
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__("bRJm");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {/* Ignore */}
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/***/ }),

/***/ "Bcfi":
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ "DYmO":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var argv = process.argv;

var terminator = argv.indexOf('--');
var hasFlag = function hasFlag(flag) {
	flag = '--' + flag;
	var pos = argv.indexOf(flag);
	return pos !== -1 && (terminator !== -1 ? pos < terminator : true);
};

module.exports = function () {
	if ('FORCE_COLOR' in process.env) {
		return true;
	}

	if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false')) {
		return false;
	}

	if (hasFlag('color') || hasFlag('colors') || hasFlag('color=true') || hasFlag('color=always')) {
		return true;
	}

	if (process.stdout && !process.stdout.isTTY) {
		return false;
	}

	if (process.platform === 'win32') {
		return true;
	}

	if ('COLORTERM' in process.env) {
		return true;
	}

	if (process.env.TERM === 'dumb') {
		return false;
	}

	if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
		return true;
	}

	return false;
}();

/***/ }),

/***/ "ED/T":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

/***/ }),

/***/ "H6Qo":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("S1cf");

function encode(val) {
  return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

/***/ }),

/***/ "I69a":
/***/ (function(module, exports) {

module.exports = { prefix: 'fab', iconName: 'github', icon: [496, 512, [], "f09b", "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"] };

/***/ }),

/***/ "JkW7":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// EXTERNAL MODULE: ./style/index.scss
var style = __webpack_require__("yY49");
var style_default = /*#__PURE__*/__webpack_require__.n(style);

// EXTERNAL MODULE: ../node_modules/preact/dist/preact.min.js
var preact_min = __webpack_require__("KM04");
var preact_min_default = /*#__PURE__*/__webpack_require__.n(preact_min);

// EXTERNAL MODULE: ../node_modules/preact-router/dist/preact-router.es.js
var preact_router_es = __webpack_require__("/QC5");

// EXTERNAL MODULE: ../node_modules/preact-router/match.js
var match = __webpack_require__("sw5u");
var match_default = /*#__PURE__*/__webpack_require__.n(match);

// CONCATENATED MODULE: ../node_modules/mitt/dist/mitt.es.js
//      
// An event handler can take an optional event argument
// and should not return a value


// An array of all currently registered event handlers for a type


// A map of event types and their corresponding event handlers.


/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *  @name mitt
 *  @returns {Mitt}
 */
function mitt(all) {
	all = all || Object.create(null);

	return {
		/**
   * Register an event handler for the given type.
   *
   * @param  {String} type	Type of event to listen for, or `"*"` for all events
   * @param  {Function} handler Function to call in response to given event
   * @memberOf mitt
   */
		on: function on(type, handler) {
			(all[type] || (all[type] = [])).push(handler);
		},

		/**
   * Remove an event handler for the given type.
   *
   * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
   * @param  {Function} handler Handler function to remove
   * @memberOf mitt
   */
		off: function off(type, handler) {
			if (all[type]) {
				all[type].splice(all[type].indexOf(handler) >>> 0, 1);
			}
		},

		/**
   * Invoke all handlers for the given type.
   * If present, `"*"` handlers are invoked after type-matched handlers.
   *
   * @param {String} type  The event type to invoke
   * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
   * @memberOf mitt
   */
		emit: function emit(type, evt) {
			(all[type] || []).slice().map(function (handler) {
				handler(evt);
			});
			(all['*'] || []).slice().map(function (handler) {
				handler(type, evt);
			});
		}
	};
}

/* harmony default export */ var mitt_es = (mitt);
//# sourceMappingURL=mitt.es.js.map
// CONCATENATED MODULE: ./services/event_emitter.js


/* harmony default export */ var event_emitter = (mitt_es());
// CONCATENATED MODULE: ./components/app/Header.js


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var _ref = Object(preact_min["h"])(
	'a',
	{ 'class': 'navbar-item', href: '/' },
	Object(preact_min["h"])(
		'figure',
		{ 'class': 'image is-24x24' },
		Object(preact_min["h"])('img', { alt: 'Startup Buzzer', src: '/assets/icons/logo.png' })
	),
	Object(preact_min["h"])(
		'p',
		{ 'class': 'subtitle' },
		'\xA0Startup Buzzer'
	)
);

var _ref2 = Object(preact_min["h"])('span', { 'aria-hidden': 'true' });

var _ref3 = Object(preact_min["h"])('span', { 'aria-hidden': 'true' });

var _ref4 = Object(preact_min["h"])('span', { 'aria-hidden': 'true' });

var Header_Header = function (_Component) {
	_inherits(Header, _Component);

	function Header(props) {
		_classCallCheck(this, Header);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = { menuActive: false };
		_this.toogleMenu = _this.toogleMenu.bind(_this);
		_this.logOut = _this.logOut.bind(_this);
		return _this;
	}

	Header.prototype.logOut = function logOut() {
		this.props.logOut();
		this.setState({ menuActive: false });
	};

	Header.prototype.toogleMenu = function toogleMenu() {
		this.setState({ menuActive: !this.state.menuActive });
	};

	Header.prototype.render = function render(props, state) {
		var isActive = state.menuActive ? 'is-active' : '';
		return Object(preact_min["h"])(
			'header',
			null,
			Object(preact_min["h"])(
				'nav',
				{ 'class': 'navbar is-primary', role: 'navigation' },
				Object(preact_min["h"])(
					'div',
					{ 'class': 'navbar-brand' },
					_ref,
					Object(preact_min["h"])(
						'a',
						{ 'class': 'navbar-burger ' + isActive,
							role: 'button',
							onClick: this.toogleMenu,
							'aria-label': 'menu',
							'aria-expanded': 'false' },
						_ref2,
						_ref3,
						_ref4
					)
				),
				props.loggedIn && Object(preact_min["h"])(
					'div',
					{ 'class': 'navbar-menu ' + isActive },
					Object(preact_min["h"])(
						'div',
						{ 'class': 'navbar-end' },
						Object(preact_min["h"])(
							'a',
							{ 'class': 'navbar-item',
								onClick: this.logOut },
							'Logout'
						)
					)
				)
			)
		);
	};

	return Header;
}(preact_min["Component"]);


// CONCATENATED MODULE: ../node_modules/linkstate/dist/linkstate.es.js
function dlv(obj, key, def, p) {
	p = 0;
	key = key.split ? key.split('.') : key;
	while (obj && p < key.length) {
		obj = obj[key[p++]];
	}
	return obj === undefined ? def : obj;
}

/** Create an Event handler function that sets a given state property.
 *	@param {Component} component	The component whose state should be updated
 *	@param {string} key				A dot-notated key path to update in the component's state
 *	@param {string} eventPath		A dot-notated key path to the value that should be retrieved from the Event or component
 *	@returns {function} linkedStateHandler
 */
function linkState(component, key, eventPath) {
	var path = key.split('.'),
	    cache = component.__lsc || (component.__lsc = {});

	return cache[key + eventPath] || (cache[key + eventPath] = function (e) {
		var t = e && e.target || this,
		    state = {},
		    obj = state,
		    v = typeof eventPath === 'string' ? dlv(e, eventPath) : t.nodeName ? t.type.match(/^che|rad/) ? t.checked : t.value : e,
		    i = 0;
		for (; i < path.length - 1; i++) {
			obj = obj[path[i]] || (obj[path[i]] = !i && component.state[path[i]] || {});
		}
		obj[path[i]] = v;
		component.setState(state);
	});
}

/* harmony default export */ var linkstate_es = (linkState);
//# sourceMappingURL=linkstate.es.js.map
// CONCATENATED MODULE: ../node_modules/@fortawesome/fontawesome/index.es.js
/*!
 * Font Awesome Free 5.0.9 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
var noop = function noop() {};

var _WINDOW = {};
var _DOCUMENT = {};
var _MUTATION_OBSERVER$1 = null;
var _PERFORMANCE = { mark: noop, measure: noop };

try {
  if (typeof window !== 'undefined') _WINDOW = window;
  if (typeof document !== 'undefined') _DOCUMENT = document;
  if (typeof MutationObserver !== 'undefined') _MUTATION_OBSERVER$1 = MutationObserver;
  if (typeof performance !== 'undefined') _PERFORMANCE = performance;
} catch (e) {}

var index_es__ref = _WINDOW.navigator || {};
var _ref$userAgent = index_es__ref.userAgent;
var userAgent = _ref$userAgent === undefined ? '' : _ref$userAgent;

var WINDOW = _WINDOW;
var DOCUMENT = _DOCUMENT;
var MUTATION_OBSERVER = _MUTATION_OBSERVER$1;
var PERFORMANCE = _PERFORMANCE;
var IS_BROWSER = !!WINDOW.document;
var IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === 'function' && typeof DOCUMENT.createElement === 'function';
var IS_IE = ~userAgent.indexOf('MSIE') || ~userAgent.indexOf('Trident/');

var NAMESPACE_IDENTIFIER = '___FONT_AWESOME___';
var UNITS_IN_GRID = 16;
var DEFAULT_FAMILY_PREFIX = 'fa';
var DEFAULT_REPLACEMENT_CLASS = 'svg-inline--fa';
var DATA_FA_I2SVG = 'data-fa-i2svg';
var DATA_FA_PSEUDO_ELEMENT = 'data-fa-pseudo-element';
var HTML_CLASS_I2SVG_BASE_CLASS = 'fontawesome-i2svg';

var PRODUCTION = function () {
  try {
    return "production" === 'production';
  } catch (e) {
    return false;
  }
}();

var oneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var oneToTwenty = oneToTen.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);

var ATTRIBUTES_WATCHED_FOR_MUTATION = ['class', 'data-prefix', 'data-icon', 'data-fa-transform', 'data-fa-mask'];

var RESERVED_CLASSES = ['xs', 'sm', 'lg', 'fw', 'ul', 'li', 'border', 'pull-left', 'pull-right', 'spin', 'pulse', 'rotate-90', 'rotate-180', 'rotate-270', 'flip-horizontal', 'flip-vertical', 'stack', 'stack-1x', 'stack-2x', 'inverse', 'layers', 'layers-text', 'layers-counter'].concat(oneToTen.map(function (n) {
  return n + 'x';
})).concat(oneToTwenty.map(function (n) {
  return 'w-' + n;
}));

var classCallCheck = function classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var toConsumableArray = function toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
};

var initial = WINDOW.FontAwesomeConfig || {};
var initialKeys = Object.keys(initial);

var _default = _extends({
  familyPrefix: DEFAULT_FAMILY_PREFIX,
  replacementClass: DEFAULT_REPLACEMENT_CLASS,
  autoReplaceSvg: true,
  autoAddCss: true,
  autoA11y: true,
  searchPseudoElements: false,
  observeMutations: true,
  keepOriginalSource: true,
  measurePerformance: false,
  showMissingIcons: true
}, initial);

if (!_default.autoReplaceSvg) _default.observeMutations = false;

var config$1 = _extends({}, _default);

WINDOW.FontAwesomeConfig = config$1;

function update(newConfig) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _params$asNewDefault = params.asNewDefault,
      asNewDefault = _params$asNewDefault === undefined ? false : _params$asNewDefault;

  var validKeys = Object.keys(config$1);
  var ok = asNewDefault ? function (k) {
    return ~validKeys.indexOf(k) && !~initialKeys.indexOf(k);
  } : function (k) {
    return ~validKeys.indexOf(k);
  };

  Object.keys(newConfig).forEach(function (configKey) {
    if (ok(configKey)) config$1[configKey] = newConfig[configKey];
  });
}

function auto(value) {
  update({
    autoReplaceSvg: value,
    observeMutations: value
  });
}

var w = WINDOW || {};

if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {};
if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {};
if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {};
if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = [];

var namespace = w[NAMESPACE_IDENTIFIER];

var functions = [];
var listener = function listener() {
  DOCUMENT.removeEventListener('DOMContentLoaded', listener);
  loaded = 1;
  functions.map(function (fn) {
    return fn();
  });
};

var loaded = false;

if (IS_DOM) {
  loaded = (DOCUMENT.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT.readyState);

  if (!loaded) DOCUMENT.addEventListener('DOMContentLoaded', listener);
}

var domready = function domready(fn) {
  if (!IS_DOM) return;
  loaded ? setTimeout(fn, 0) : functions.push(fn);
};

var d = UNITS_IN_GRID;

var meaninglessTransform = {
  size: 16,
  x: 0,
  y: 0,
  rotate: 0,
  flipX: false,
  flipY: false
};

function isReserved(name) {
  return ~RESERVED_CLASSES.indexOf(name);
}

function bunker(fn) {
  try {
    fn();
  } catch (e) {
    if (!PRODUCTION) {
      throw e;
    }
  }
}

function insertCss(css) {
  if (!css || !IS_DOM) {
    return;
  }

  var style = DOCUMENT.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = css;

  var headChildren = DOCUMENT.head.childNodes;
  var beforeChild = null;

  for (var i = headChildren.length - 1; i > -1; i--) {
    var child = headChildren[i];
    var tagName = (child.tagName || '').toUpperCase();
    if (['STYLE', 'LINK'].indexOf(tagName) > -1) {
      beforeChild = child;
    }
  }

  DOCUMENT.head.insertBefore(style, beforeChild);

  return css;
}

var _uniqueId = 0;

function nextUniqueId() {
  _uniqueId++;

  return _uniqueId;
}

function toArray(obj) {
  var array = [];

  for (var i = (obj || []).length >>> 0; i--;) {
    array[i] = obj[i];
  }

  return array;
}

function classArray(node) {
  if (node.classList) {
    return toArray(node.classList);
  } else {
    return (node.getAttribute('class') || '').split(' ').filter(function (i) {
      return i;
    });
  }
}

function getIconName(familyPrefix, cls) {
  var parts = cls.split('-');
  var prefix = parts[0];
  var iconName = parts.slice(1).join('-');

  if (prefix === familyPrefix && iconName !== '' && !isReserved(iconName)) {
    return iconName;
  } else {
    return null;
  }
}

function htmlEscape(str) {
  return ('' + str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function joinAttributes(attributes) {
  return Object.keys(attributes || {}).reduce(function (acc, attributeName) {
    return acc + (attributeName + '="' + htmlEscape(attributes[attributeName]) + '" ');
  }, '').trim();
}

function joinStyles(styles) {
  return Object.keys(styles || {}).reduce(function (acc, styleName) {
    return acc + (styleName + ': ' + styles[styleName] + ';');
  }, '');
}

function transformIsMeaningful(transform) {
  return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
}

function transformForSvg(_ref) {
  var transform = _ref.transform,
      containerWidth = _ref.containerWidth,
      iconWidth = _ref.iconWidth;

  var outer = {
    transform: 'translate(' + containerWidth / 2 + ' 256)'
  };
  var innerTranslate = 'translate(' + transform.x * 32 + ', ' + transform.y * 32 + ') ';
  var innerScale = 'scale(' + transform.size / 16 * (transform.flipX ? -1 : 1) + ', ' + transform.size / 16 * (transform.flipY ? -1 : 1) + ') ';
  var innerRotate = 'rotate(' + transform.rotate + ' 0 0)';
  var inner = {
    transform: innerTranslate + ' ' + innerScale + ' ' + innerRotate
  };
  var path = {
    transform: 'translate(' + iconWidth / 2 * -1 + ' -256)'
  };
  return {
    outer: outer,
    inner: inner,
    path: path
  };
}

function transformForCss(_ref2) {
  var transform = _ref2.transform,
      _ref2$width = _ref2.width,
      width = _ref2$width === undefined ? UNITS_IN_GRID : _ref2$width,
      _ref2$height = _ref2.height,
      height = _ref2$height === undefined ? UNITS_IN_GRID : _ref2$height,
      _ref2$startCentered = _ref2.startCentered,
      startCentered = _ref2$startCentered === undefined ? false : _ref2$startCentered;

  var val = '';

  if (startCentered && IS_IE) {
    val += 'translate(' + (transform.x / d - width / 2) + 'em, ' + (transform.y / d - height / 2) + 'em) ';
  } else if (startCentered) {
    val += 'translate(calc(-50% + ' + transform.x / d + 'em), calc(-50% + ' + transform.y / d + 'em)) ';
  } else {
    val += 'translate(' + transform.x / d + 'em, ' + transform.y / d + 'em) ';
  }

  val += 'scale(' + transform.size / d * (transform.flipX ? -1 : 1) + ', ' + transform.size / d * (transform.flipY ? -1 : 1) + ') ';
  val += 'rotate(' + transform.rotate + 'deg) ';

  return val;
}

var ALL_SPACE = {
  x: 0,
  y: 0,
  width: '100%',
  height: '100%'
};

var makeIconMasking = function makeIconMasking(_ref) {
  var children = _ref.children,
      attributes = _ref.attributes,
      main = _ref.main,
      mask = _ref.mask,
      transform = _ref.transform;
  var mainWidth = main.width,
      mainPath = main.icon;
  var maskWidth = mask.width,
      maskPath = mask.icon;

  var trans = transformForSvg({ transform: transform, containerWidth: maskWidth, iconWidth: mainWidth });

  var maskRect = {
    tag: 'rect',
    attributes: _extends({}, ALL_SPACE, {
      fill: 'white'
    })
  };
  var maskInnerGroup = {
    tag: 'g',
    attributes: _extends({}, trans.inner),
    children: [{ tag: 'path', attributes: _extends({}, mainPath.attributes, trans.path, { fill: 'black' }) }]
  };
  var maskOuterGroup = {
    tag: 'g',
    attributes: _extends({}, trans.outer),
    children: [maskInnerGroup]
  };
  var maskId = 'mask-' + nextUniqueId();
  var clipId = 'clip-' + nextUniqueId();
  var maskTag = {
    tag: 'mask',
    attributes: _extends({}, ALL_SPACE, {
      id: maskId,
      maskUnits: 'userSpaceOnUse',
      maskContentUnits: 'userSpaceOnUse'
    }),
    children: [maskRect, maskOuterGroup]
  };
  var defs = {
    tag: 'defs',
    children: [{ tag: 'clipPath', attributes: { id: clipId }, children: [maskPath] }, maskTag]
  };

  children.push(defs, { tag: 'rect', attributes: _extends({ fill: 'currentColor', 'clip-path': 'url(#' + clipId + ')', mask: 'url(#' + maskId + ')' }, ALL_SPACE) });

  return {
    children: children,
    attributes: attributes
  };
};

var makeIconStandard = function makeIconStandard(_ref) {
  var children = _ref.children,
      attributes = _ref.attributes,
      main = _ref.main,
      transform = _ref.transform,
      styles = _ref.styles;

  var styleString = joinStyles(styles);

  if (styleString.length > 0) {
    attributes['style'] = styleString;
  }

  if (transformIsMeaningful(transform)) {
    var trans = transformForSvg({ transform: transform, containerWidth: main.width, iconWidth: main.width });
    children.push({
      tag: 'g',
      attributes: _extends({}, trans.outer),
      children: [{
        tag: 'g',
        attributes: _extends({}, trans.inner),
        children: [{
          tag: main.icon.tag,
          children: main.icon.children,
          attributes: _extends({}, main.icon.attributes, trans.path)
        }]
      }]
    });
  } else {
    children.push(main.icon);
  }

  return {
    children: children,
    attributes: attributes
  };
};

var asIcon = function asIcon(_ref) {
  var children = _ref.children,
      main = _ref.main,
      mask = _ref.mask,
      attributes = _ref.attributes,
      styles = _ref.styles,
      transform = _ref.transform;

  if (transformIsMeaningful(transform) && main.found && !mask.found) {
    var width = main.width,
        height = main.height;

    var offset = {
      x: width / height / 2,
      y: 0.5
    };
    attributes['style'] = joinStyles(_extends({}, styles, {
      'transform-origin': offset.x + transform.x / 16 + 'em ' + (offset.y + transform.y / 16) + 'em'
    }));
  }

  return [{
    tag: 'svg',
    attributes: attributes,
    children: children
  }];
};

var asSymbol = function asSymbol(_ref) {
  var prefix = _ref.prefix,
      iconName = _ref.iconName,
      children = _ref.children,
      attributes = _ref.attributes,
      symbol = _ref.symbol;

  var id = symbol === true ? prefix + '-' + config$1.familyPrefix + '-' + iconName : symbol;

  return [{
    tag: 'svg',
    attributes: {
      style: 'display: none;'
    },
    children: [{
      tag: 'symbol',
      attributes: _extends({}, attributes, { id: id }),
      children: children
    }]
  }];
};

function makeInlineSvgAbstract(params) {
  var _params$icons = params.icons,
      main = _params$icons.main,
      mask = _params$icons.mask,
      prefix = params.prefix,
      iconName = params.iconName,
      transform = params.transform,
      symbol = params.symbol,
      title = params.title,
      extra = params.extra,
      _params$watchable = params.watchable,
      watchable = _params$watchable === undefined ? false : _params$watchable;

  var _ref = mask.found ? mask : main,
      width = _ref.width,
      height = _ref.height;

  var widthClass = 'fa-w-' + Math.ceil(width / height * 16);
  var attrClass = [config$1.replacementClass, iconName ? config$1.familyPrefix + '-' + iconName : '', widthClass].concat(extra.classes).join(' ');

  var content = {
    children: [],
    attributes: _extends({}, extra.attributes, {
      'data-prefix': prefix,
      'data-icon': iconName,
      'class': attrClass,
      'role': 'img',
      'xmlns': 'http://www.w3.org/2000/svg',
      'viewBox': '0 0 ' + width + ' ' + height
    })
  };

  if (watchable) {
    content.attributes[DATA_FA_I2SVG] = '';
  }

  if (title) content.children.push({ tag: 'title', attributes: { id: content.attributes['aria-labelledby'] || 'title-' + nextUniqueId() }, children: [title] });

  var args = _extends({}, content, {
    prefix: prefix,
    iconName: iconName,
    main: main,
    mask: mask,
    transform: transform,
    symbol: symbol,
    styles: extra.styles
  });

  var _ref2 = mask.found && main.found ? makeIconMasking(args) : makeIconStandard(args),
      children = _ref2.children,
      attributes = _ref2.attributes;

  args.children = children;
  args.attributes = attributes;

  if (symbol) {
    return asSymbol(args);
  } else {
    return asIcon(args);
  }
}

function makeLayersTextAbstract(params) {
  var content = params.content,
      width = params.width,
      height = params.height,
      transform = params.transform,
      title = params.title,
      extra = params.extra,
      _params$watchable2 = params.watchable,
      watchable = _params$watchable2 === undefined ? false : _params$watchable2;

  var attributes = _extends({}, extra.attributes, title ? { 'title': title } : {}, {
    'class': extra.classes.join(' ')
  });

  if (watchable) {
    attributes[DATA_FA_I2SVG] = '';
  }

  var styles = _extends({}, extra.styles);

  if (transformIsMeaningful(transform)) {
    styles['transform'] = transformForCss({ transform: transform, startCentered: true, width: width, height: height });
    styles['-webkit-transform'] = styles['transform'];
  }

  var styleString = joinStyles(styles);

  if (styleString.length > 0) {
    attributes['style'] = styleString;
  }

  var val = [];

  val.push({
    tag: 'span',
    attributes: attributes,
    children: [content]
  });

  if (title) {
    val.push({ tag: 'span', attributes: { class: 'sr-only' }, children: [title] });
  }

  return val;
}

var noop$2 = function noop() {};
var p = config$1.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : { mark: noop$2, measure: noop$2 };
var preamble = 'FA "5.0.9"';

var begin = function begin(name) {
  p.mark(preamble + ' ' + name + ' begins');
  return function () {
    return end(name);
  };
};

var end = function end(name) {
  p.mark(preamble + ' ' + name + ' ends');
  p.measure(preamble + ' ' + name, preamble + ' ' + name + ' begins', preamble + ' ' + name + ' ends');
};

var perf = { begin: begin, end: end };

'use strict';

/**
 * Internal helper to bind a function known to have 4 arguments
 * to a given context.
 */
var bindInternal4 = function bindInternal4(func, thisContext) {
  return function (a, b, c, d) {
    return func.call(thisContext, a, b, c, d);
  };
};

'use strict';

/**
 * # Reduce
 *
 * A fast object `.reduce()` implementation.
 *
 * @param  {Object}   subject      The object to reduce over.
 * @param  {Function} fn           The reducer function.
 * @param  {mixed}    initialValue The initial value for the reducer, defaults to subject[0].
 * @param  {Object}   thisContext  The context for the reducer.
 * @return {mixed}                 The final result.
 */
var reduce = function fastReduceObject(subject, fn, initialValue, thisContext) {
  var keys = Object.keys(subject),
      length = keys.length,
      iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn,
      i,
      key,
      result;

  if (initialValue === undefined) {
    i = 1;
    result = subject[keys[0]];
  } else {
    i = 0;
    result = initialValue;
  }

  for (; i < length; i++) {
    key = keys[i];
    result = iterator(result, subject[key], key, subject);
  }

  return result;
};

var styles$2 = namespace.styles;
var shims = namespace.shims;

var _byUnicode = {};
var _byLigature = {};
var _byOldName = {};

var build = function build() {
  var lookup = function lookup(reducer) {
    return reduce(styles$2, function (o, style, prefix) {
      o[prefix] = reduce(style, reducer, {});
      return o;
    }, {});
  };

  _byUnicode = lookup(function (acc, icon, iconName) {
    acc[icon[3]] = iconName;

    return acc;
  });

  _byLigature = lookup(function (acc, icon, iconName) {
    var ligatures = icon[2];

    acc[iconName] = iconName;

    ligatures.forEach(function (ligature) {
      acc[ligature] = iconName;
    });

    return acc;
  });

  var hasRegular = 'far' in styles$2;

  _byOldName = reduce(shims, function (acc, shim) {
    var oldName = shim[0];
    var prefix = shim[1];
    var iconName = shim[2];

    if (prefix === 'far' && !hasRegular) {
      prefix = 'fas';
    }

    acc[oldName] = { prefix: prefix, iconName: iconName };

    return acc;
  }, {});
};

build();

function byUnicode(prefix, unicode) {
  return _byUnicode[prefix][unicode];
}

function byLigature(prefix, ligature) {
  return _byLigature[prefix][ligature];
}

function byOldName(name) {
  return _byOldName[name] || { prefix: null, iconName: null };
}

var styles$1 = namespace.styles;

var emptyCanonicalIcon = function emptyCanonicalIcon() {
  return { prefix: null, iconName: null, rest: [] };
};

function getCanonicalIcon(values) {
  return values.reduce(function (acc, cls) {
    var iconName = getIconName(config$1.familyPrefix, cls);

    if (styles$1[cls]) {
      acc.prefix = cls;
    } else if (iconName) {
      var shim = acc.prefix === 'fa' ? byOldName(iconName) : {};

      acc.iconName = shim.iconName || iconName;
      acc.prefix = shim.prefix || acc.prefix;
    } else if (cls !== config$1.replacementClass && cls.indexOf('fa-w-') !== 0) {
      acc.rest.push(cls);
    }

    return acc;
  }, emptyCanonicalIcon());
}

function iconFromMapping(mapping, prefix, iconName) {
  if (mapping && mapping[prefix] && mapping[prefix][iconName]) {
    return {
      prefix: prefix,
      iconName: iconName,
      icon: mapping[prefix][iconName]
    };
  }
}

function toHtml(abstractNodes) {
  var tag = abstractNodes.tag,
      _abstractNodes$attrib = abstractNodes.attributes,
      attributes = _abstractNodes$attrib === undefined ? {} : _abstractNodes$attrib,
      _abstractNodes$childr = abstractNodes.children,
      children = _abstractNodes$childr === undefined ? [] : _abstractNodes$childr;

  if (typeof abstractNodes === 'string') {
    return htmlEscape(abstractNodes);
  } else {
    return '<' + tag + ' ' + joinAttributes(attributes) + '>' + children.map(toHtml).join('') + '</' + tag + '>';
  }
}

var noop$1 = function noop() {};

function isWatched(node) {
  var i2svg = node.getAttribute ? node.getAttribute(DATA_FA_I2SVG) : null;

  return typeof i2svg === 'string';
}

function getMutator() {
  if (config$1.autoReplaceSvg === true) {
    return mutators.replace;
  }

  var mutator = mutators[config$1.autoReplaceSvg];

  return mutator || mutators.replace;
}

var mutators = {
  replace: function replace(mutation) {
    var node = mutation[0];
    var abstract = mutation[1];
    var newOuterHTML = abstract.map(function (a) {
      return toHtml(a);
    }).join('\n');

    if (node.parentNode && node.outerHTML) {
      node.outerHTML = newOuterHTML + (config$1.keepOriginalSource && node.tagName.toLowerCase() !== 'svg' ? '<!-- ' + node.outerHTML + ' -->' : '');
    } else if (node.parentNode) {
      var newNode = document.createElement('span');
      node.parentNode.replaceChild(newNode, node);
      newNode.outerHTML = newOuterHTML;
    }
  },
  nest: function nest(mutation) {
    var node = mutation[0];
    var abstract = mutation[1];

    // If we already have a replaced node we do not want to continue nesting within it.
    // Short-circuit to the standard replacement
    if (~classArray(node).indexOf(config$1.replacementClass)) {
      return mutators.replace(mutation);
    }

    var forSvg = new RegExp(config$1.familyPrefix + '-.*');

    delete abstract[0].attributes.style;

    var splitClasses = abstract[0].attributes.class.split(' ').reduce(function (acc, cls) {
      if (cls === config$1.replacementClass || cls.match(forSvg)) {
        acc.toSvg.push(cls);
      } else {
        acc.toNode.push(cls);
      }

      return acc;
    }, { toNode: [], toSvg: [] });

    abstract[0].attributes.class = splitClasses.toSvg.join(' ');

    var newInnerHTML = abstract.map(function (a) {
      return toHtml(a);
    }).join('\n');
    node.setAttribute('class', splitClasses.toNode.join(' '));
    node.setAttribute(DATA_FA_I2SVG, '');
    node.innerHTML = newInnerHTML;
  }
};

function perform(mutations, callback) {
  var callbackFunction = typeof callback === 'function' ? callback : noop$1;

  if (mutations.length === 0) {
    callbackFunction();
  } else {
    var frame = WINDOW.requestAnimationFrame || function (op) {
      return op();
    };

    frame(function () {
      var mutator = getMutator();
      var mark = perf.begin('mutate');

      mutations.map(mutator);

      mark();

      callbackFunction();
    });
  }
}

var disabled = false;

function disableObservation(operation) {
  disabled = true;
  operation();
  disabled = false;
}

var mo = null;

function observe(options) {
  if (!MUTATION_OBSERVER) return;

  var treeCallback = options.treeCallback,
      nodeCallback = options.nodeCallback,
      pseudoElementsCallback = options.pseudoElementsCallback;

  mo = new MUTATION_OBSERVER(function (objects) {
    if (disabled) return;

    toArray(objects).forEach(function (mutationRecord) {
      if (mutationRecord.type === 'childList' && mutationRecord.addedNodes.length > 0 && !isWatched(mutationRecord.addedNodes[0])) {
        if (config$1.searchPseudoElements) {
          pseudoElementsCallback(mutationRecord.target);
        }

        treeCallback(mutationRecord.target);
      }

      if (mutationRecord.type === 'attributes' && mutationRecord.target.parentNode && config$1.searchPseudoElements) {
        pseudoElementsCallback(mutationRecord.target.parentNode);
      }

      if (mutationRecord.type === 'attributes' && isWatched(mutationRecord.target) && ~ATTRIBUTES_WATCHED_FOR_MUTATION.indexOf(mutationRecord.attributeName)) {
        if (mutationRecord.attributeName === 'class') {
          var _getCanonicalIcon = getCanonicalIcon(classArray(mutationRecord.target)),
              prefix = _getCanonicalIcon.prefix,
              iconName = _getCanonicalIcon.iconName;

          if (prefix) mutationRecord.target.setAttribute('data-prefix', prefix);
          if (iconName) mutationRecord.target.setAttribute('data-icon', iconName);
        } else {
          nodeCallback(mutationRecord.target);
        }
      }
    });
  });

  if (!IS_DOM) return;

  mo.observe(DOCUMENT.getElementsByTagName('body')[0], {
    childList: true, attributes: true, characterData: true, subtree: true
  });
}

function disconnect() {
  if (!mo) return;

  mo.disconnect();
}

var styleParser = function styleParser(node) {
  var style = node.getAttribute('style');

  var val = [];

  if (style) {
    val = style.split(';').reduce(function (acc, style) {
      var styles = style.split(':');
      var prop = styles[0];
      var value = styles.slice(1);

      if (prop && value.length > 0) {
        acc[prop] = value.join(':').trim();
      }

      return acc;
    }, {});
  }

  return val;
};

function toHex(unicode) {
  var result = '';

  for (var i = 0; i < unicode.length; i++) {
    var hex = unicode.charCodeAt(i).toString(16);
    result += ('000' + hex).slice(-4);
  }

  return result;
}

var classParser = function classParser(node) {
  var existingPrefix = node.getAttribute('data-prefix');
  var existingIconName = node.getAttribute('data-icon');
  var innerText = node.innerText !== undefined ? node.innerText.trim() : '';

  var val = getCanonicalIcon(classArray(node));

  if (existingPrefix && existingIconName) {
    val.prefix = existingPrefix;
    val.iconName = existingIconName;
  }

  if (val.prefix && innerText.length > 1) {
    val.iconName = byLigature(val.prefix, node.innerText);
  } else if (val.prefix && innerText.length === 1) {
    val.iconName = byUnicode(val.prefix, toHex(node.innerText));
  }

  return val;
};

var parseTransformString = function parseTransformString(transformString) {
  var transform = {
    size: 16,
    x: 0,
    y: 0,
    flipX: false,
    flipY: false,
    rotate: 0
  };

  if (!transformString) {
    return transform;
  } else {
    return transformString.toLowerCase().split(' ').reduce(function (acc, n) {
      var parts = n.toLowerCase().split('-');
      var first = parts[0];
      var rest = parts.slice(1).join('-');

      if (first && rest === 'h') {
        acc.flipX = true;
        return acc;
      }

      if (first && rest === 'v') {
        acc.flipY = true;
        return acc;
      }

      rest = parseFloat(rest);

      if (isNaN(rest)) {
        return acc;
      }

      switch (first) {
        case 'grow':
          acc.size = acc.size + rest;
          break;
        case 'shrink':
          acc.size = acc.size - rest;
          break;
        case 'left':
          acc.x = acc.x - rest;
          break;
        case 'right':
          acc.x = acc.x + rest;
          break;
        case 'up':
          acc.y = acc.y - rest;
          break;
        case 'down':
          acc.y = acc.y + rest;
          break;
        case 'rotate':
          acc.rotate = acc.rotate + rest;
          break;
      }

      return acc;
    }, transform);
  }
};

var transformParser = function transformParser(node) {
  return parseTransformString(node.getAttribute('data-fa-transform'));
};

var symbolParser = function symbolParser(node) {
  var symbol = node.getAttribute('data-fa-symbol');

  return symbol === null ? false : symbol === '' ? true : symbol;
};

var attributesParser = function attributesParser(node) {
  var extraAttributes = toArray(node.attributes).reduce(function (acc, attr) {
    if (acc.name !== 'class' && acc.name !== 'style') {
      acc[attr.name] = attr.value;
    }
    return acc;
  }, {});

  var title = node.getAttribute('title');

  if (config$1.autoA11y) {
    if (title) {
      extraAttributes['aria-labelledby'] = config$1.replacementClass + '-title-' + nextUniqueId();
    } else {
      extraAttributes['aria-hidden'] = 'true';
    }
  }

  return extraAttributes;
};

var maskParser = function maskParser(node) {
  var mask = node.getAttribute('data-fa-mask');

  if (!mask) {
    return emptyCanonicalIcon();
  } else {
    return getCanonicalIcon(mask.split(' ').map(function (i) {
      return i.trim();
    }));
  }
};

function parseMeta(node) {
  var _classParser = classParser(node),
      iconName = _classParser.iconName,
      prefix = _classParser.prefix,
      extraClasses = _classParser.rest;

  var extraStyles = styleParser(node);
  var transform = transformParser(node);
  var symbol = symbolParser(node);
  var extraAttributes = attributesParser(node);
  var mask = maskParser(node);

  return {
    iconName: iconName,
    title: node.getAttribute('title'),
    prefix: prefix,
    transform: transform,
    symbol: symbol,
    mask: mask,
    extra: {
      classes: extraClasses,
      styles: extraStyles,
      attributes: extraAttributes
    }
  };
}

function MissingIcon(error) {
  this.name = 'MissingIcon';
  this.message = error || 'Icon unavailable';
  this.stack = new Error().stack;
}

MissingIcon.prototype = Object.create(Error.prototype);
MissingIcon.prototype.constructor = MissingIcon;

var FILL = { fill: 'currentColor' };
var ANIMATION_BASE = {
  attributeType: 'XML',
  repeatCount: 'indefinite',
  dur: '2s'
};
var RING = {
  tag: 'path',
  attributes: _extends({}, FILL, {
    d: 'M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z'
  })
};
var OPACITY_ANIMATE = _extends({}, ANIMATION_BASE, {
  attributeName: 'opacity'
});
var DOT = {
  tag: 'circle',
  attributes: _extends({}, FILL, {
    cx: '256',
    cy: '364',
    r: '28'
  }),
  children: [{ tag: 'animate', attributes: _extends({}, ANIMATION_BASE, { attributeName: 'r', values: '28;14;28;28;14;28;' }) }, { tag: 'animate', attributes: _extends({}, OPACITY_ANIMATE, { values: '1;0;1;1;0;1;' }) }]
};
var QUESTION = {
  tag: 'path',
  attributes: _extends({}, FILL, {
    opacity: '1',
    d: 'M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z'
  }),
  children: [{ tag: 'animate', attributes: _extends({}, OPACITY_ANIMATE, { values: '1;0;0;0;0;1;' }) }]
};
var EXCLAMATION = {
  tag: 'path',
  attributes: _extends({}, FILL, {
    opacity: '0',
    d: 'M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z'
  }),
  children: [{ tag: 'animate', attributes: _extends({}, OPACITY_ANIMATE, { values: '0;0;1;1;0;0;' }) }]
};

var missing = { tag: 'g', children: [RING, DOT, QUESTION, EXCLAMATION] };

var styles = namespace.styles;

var LAYERS_TEXT_CLASSNAME = 'fa-layers-text';
var FONT_FAMILY_PATTERN = /Font Awesome 5 (Solid|Regular|Light|Brands)/;
var STYLE_TO_PREFIX = {
  'Solid': 'fas',
  'Regular': 'far',
  'Light': 'fal',
  'Brands': 'fab'
};

function findIcon(iconName, prefix) {
  var val = {
    found: false,
    width: 512,
    height: 512,
    icon: missing
  };

  if (iconName && prefix && styles[prefix] && styles[prefix][iconName]) {
    var icon = styles[prefix][iconName];
    var width = icon[0];
    var height = icon[1];
    var vectorData = icon.slice(4);

    val = {
      found: true,
      width: width,
      height: height,
      icon: { tag: 'path', attributes: { fill: 'currentColor', d: vectorData[0] } }
    };
  } else if (iconName && prefix && !config$1.showMissingIcons) {
    throw new MissingIcon('Icon is missing for prefix ' + prefix + ' with icon name ' + iconName);
  }

  return val;
}

function generateSvgReplacementMutation(node, nodeMeta) {
  var iconName = nodeMeta.iconName,
      title = nodeMeta.title,
      prefix = nodeMeta.prefix,
      transform = nodeMeta.transform,
      symbol = nodeMeta.symbol,
      mask = nodeMeta.mask,
      extra = nodeMeta.extra;

  return [node, makeInlineSvgAbstract({
    icons: {
      main: findIcon(iconName, prefix),
      mask: findIcon(mask.iconName, mask.prefix)
    },
    prefix: prefix,
    iconName: iconName,
    transform: transform,
    symbol: symbol,
    mask: mask,
    title: title,
    extra: extra,
    watchable: true
  })];
}

function generateLayersText(node, nodeMeta) {
  var title = nodeMeta.title,
      transform = nodeMeta.transform,
      extra = nodeMeta.extra;

  var width = null;
  var height = null;

  if (IS_IE) {
    var computedFontSize = parseInt(getComputedStyle(node).fontSize, 10);
    var boundingClientRect = node.getBoundingClientRect();
    width = boundingClientRect.width / computedFontSize;
    height = boundingClientRect.height / computedFontSize;
  }

  if (config$1.autoA11y && !title) {
    extra.attributes['aria-hidden'] = 'true';
  }

  return [node, makeLayersTextAbstract({
    content: node.innerHTML,
    width: width,
    height: height,
    transform: transform,
    title: title,
    extra: extra,
    watchable: true
  })];
}

function generateMutation(node) {
  var nodeMeta = parseMeta(node);

  if (~nodeMeta.extra.classes.indexOf(LAYERS_TEXT_CLASSNAME)) {
    return generateLayersText(node, nodeMeta);
  } else {
    return generateSvgReplacementMutation(node, nodeMeta);
  }
}

function remove(node) {
  if (typeof node.remove === 'function') {
    node.remove();
  } else if (node && node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

function searchPseudoElements(root) {
  if (!IS_DOM) return;

  var end = perf.begin('searchPseudoElements');

  disableObservation(function () {
    toArray(root.querySelectorAll('*')).forEach(function (node) {
      [':before', ':after'].forEach(function (pos) {
        var styles = WINDOW.getComputedStyle(node, pos);
        var fontFamily = styles.getPropertyValue('font-family').match(FONT_FAMILY_PATTERN);
        var children = toArray(node.children);
        var pseudoElement = children.filter(function (c) {
          return c.getAttribute(DATA_FA_PSEUDO_ELEMENT) === pos;
        })[0];

        if (pseudoElement) {
          if (pseudoElement.nextSibling && pseudoElement.nextSibling.textContent.indexOf(DATA_FA_PSEUDO_ELEMENT) > -1) {
            remove(pseudoElement.nextSibling);
          }
          remove(pseudoElement);
          pseudoElement = null;
        }

        if (fontFamily && !pseudoElement) {
          var content = styles.getPropertyValue('content');
          var i = DOCUMENT.createElement('i');
          i.setAttribute('class', '' + STYLE_TO_PREFIX[fontFamily[1]]);
          i.setAttribute(DATA_FA_PSEUDO_ELEMENT, pos);
          i.innerText = content.length === 3 ? content.substr(1, 1) : content;
          if (pos === ':before') {
            node.insertBefore(i, node.firstChild);
          } else {
            node.appendChild(i);
          }
        }
      });
    });
  });

  end();
}

function onTree(root) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (!IS_DOM) return;

  var htmlClassList = DOCUMENT.documentElement.classList;
  var hclAdd = function hclAdd(suffix) {
    return htmlClassList.add(HTML_CLASS_I2SVG_BASE_CLASS + '-' + suffix);
  };
  var hclRemove = function hclRemove(suffix) {
    return htmlClassList.remove(HTML_CLASS_I2SVG_BASE_CLASS + '-' + suffix);
  };
  var prefixes = Object.keys(styles);
  var prefixesDomQuery = ['.' + LAYERS_TEXT_CLASSNAME + ':not([' + DATA_FA_I2SVG + '])'].concat(prefixes.map(function (p) {
    return '.' + p + ':not([' + DATA_FA_I2SVG + '])';
  })).join(', ');

  if (prefixesDomQuery.length === 0) {
    return;
  }

  var candidates = toArray(root.querySelectorAll(prefixesDomQuery));

  if (candidates.length > 0) {
    hclAdd('pending');
    hclRemove('complete');
  } else {
    return;
  }

  var mark = perf.begin('onTree');

  var mutations = candidates.reduce(function (acc, node) {
    try {
      var mutation = generateMutation(node);

      if (mutation) {
        acc.push(mutation);
      }
    } catch (e) {
      if (!PRODUCTION) {
        if (e instanceof MissingIcon) {
          console.error(e);
        }
      }
    }

    return acc;
  }, []);

  mark();

  perform(mutations, function () {
    hclAdd('active');
    hclAdd('complete');
    hclRemove('pending');

    if (typeof callback === 'function') callback();
  });
}

function onNode(node) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var mutation = generateMutation(node);

  if (mutation) {
    perform([mutation], callback);
  }
}

var baseStyles = "svg:not(:root).svg-inline--fa {\n  overflow: visible; }\n\n.svg-inline--fa {\n  display: inline-block;\n  font-size: inherit;\n  height: 1em;\n  overflow: visible;\n  vertical-align: -.125em; }\n  .svg-inline--fa.fa-lg {\n    vertical-align: -.225em; }\n  .svg-inline--fa.fa-w-1 {\n    width: 0.0625em; }\n  .svg-inline--fa.fa-w-2 {\n    width: 0.125em; }\n  .svg-inline--fa.fa-w-3 {\n    width: 0.1875em; }\n  .svg-inline--fa.fa-w-4 {\n    width: 0.25em; }\n  .svg-inline--fa.fa-w-5 {\n    width: 0.3125em; }\n  .svg-inline--fa.fa-w-6 {\n    width: 0.375em; }\n  .svg-inline--fa.fa-w-7 {\n    width: 0.4375em; }\n  .svg-inline--fa.fa-w-8 {\n    width: 0.5em; }\n  .svg-inline--fa.fa-w-9 {\n    width: 0.5625em; }\n  .svg-inline--fa.fa-w-10 {\n    width: 0.625em; }\n  .svg-inline--fa.fa-w-11 {\n    width: 0.6875em; }\n  .svg-inline--fa.fa-w-12 {\n    width: 0.75em; }\n  .svg-inline--fa.fa-w-13 {\n    width: 0.8125em; }\n  .svg-inline--fa.fa-w-14 {\n    width: 0.875em; }\n  .svg-inline--fa.fa-w-15 {\n    width: 0.9375em; }\n  .svg-inline--fa.fa-w-16 {\n    width: 1em; }\n  .svg-inline--fa.fa-w-17 {\n    width: 1.0625em; }\n  .svg-inline--fa.fa-w-18 {\n    width: 1.125em; }\n  .svg-inline--fa.fa-w-19 {\n    width: 1.1875em; }\n  .svg-inline--fa.fa-w-20 {\n    width: 1.25em; }\n  .svg-inline--fa.fa-pull-left {\n    margin-right: .3em;\n    width: auto; }\n  .svg-inline--fa.fa-pull-right {\n    margin-left: .3em;\n    width: auto; }\n  .svg-inline--fa.fa-border {\n    height: 1.5em; }\n  .svg-inline--fa.fa-li {\n    width: 2em; }\n  .svg-inline--fa.fa-fw {\n    width: 1.25em; }\n\n.fa-layers svg.svg-inline--fa {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0; }\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -.125em;\n  width: 1em; }\n  .fa-layers svg.svg-inline--fa {\n    -webkit-transform-origin: center center;\n            transform-origin: center center; }\n\n.fa-layers-text, .fa-layers-counter {\n  display: inline-block;\n  position: absolute;\n  text-align: center; }\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  -webkit-transform-origin: center center;\n          transform-origin: center center; }\n\n.fa-layers-counter {\n  background-color: #ff253a;\n  border-radius: 1em;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  color: #fff;\n  height: 1.5em;\n  line-height: 1;\n  max-width: 5em;\n  min-width: 1.5em;\n  overflow: hidden;\n  padding: .25em;\n  right: 0;\n  text-overflow: ellipsis;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right; }\n\n.fa-layers-bottom-right {\n  bottom: 0;\n  right: 0;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom right;\n          transform-origin: bottom right; }\n\n.fa-layers-bottom-left {\n  bottom: 0;\n  left: 0;\n  right: auto;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom left;\n          transform-origin: bottom left; }\n\n.fa-layers-top-right {\n  right: 0;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right; }\n\n.fa-layers-top-left {\n  left: 0;\n  right: auto;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top left;\n          transform-origin: top left; }\n\n.fa-lg {\n  font-size: 1.33333em;\n  line-height: 0.75em;\n  vertical-align: -.0667em; }\n\n.fa-xs {\n  font-size: .75em; }\n\n.fa-sm {\n  font-size: .875em; }\n\n.fa-1x {\n  font-size: 1em; }\n\n.fa-2x {\n  font-size: 2em; }\n\n.fa-3x {\n  font-size: 3em; }\n\n.fa-4x {\n  font-size: 4em; }\n\n.fa-5x {\n  font-size: 5em; }\n\n.fa-6x {\n  font-size: 6em; }\n\n.fa-7x {\n  font-size: 7em; }\n\n.fa-8x {\n  font-size: 8em; }\n\n.fa-9x {\n  font-size: 9em; }\n\n.fa-10x {\n  font-size: 10em; }\n\n.fa-fw {\n  text-align: center;\n  width: 1.25em; }\n\n.fa-ul {\n  list-style-type: none;\n  margin-left: 2.5em;\n  padding-left: 0; }\n  .fa-ul > li {\n    position: relative; }\n\n.fa-li {\n  left: -2em;\n  position: absolute;\n  text-align: center;\n  width: 2em;\n  line-height: inherit; }\n\n.fa-border {\n  border: solid 0.08em #eee;\n  border-radius: .1em;\n  padding: .2em .25em .15em; }\n\n.fa-pull-left {\n  float: left; }\n\n.fa-pull-right {\n  float: right; }\n\n.fa.fa-pull-left,\n.fas.fa-pull-left,\n.far.fa-pull-left,\n.fal.fa-pull-left,\n.fab.fa-pull-left {\n  margin-right: .3em; }\n\n.fa.fa-pull-right,\n.fas.fa-pull-right,\n.far.fa-pull-right,\n.fal.fa-pull-right,\n.fab.fa-pull-right {\n  margin-left: .3em; }\n\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n          animation: fa-spin 2s infinite linear; }\n\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n          animation: fa-spin 1s infinite steps(8); }\n\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n.fa-rotate-90 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";\n  -webkit-transform: rotate(90deg);\n          transform: rotate(90deg); }\n\n.fa-rotate-180 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";\n  -webkit-transform: rotate(180deg);\n          transform: rotate(180deg); }\n\n.fa-rotate-270 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";\n  -webkit-transform: rotate(270deg);\n          transform: rotate(270deg); }\n\n.fa-flip-horizontal {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";\n  -webkit-transform: scale(-1, 1);\n          transform: scale(-1, 1); }\n\n.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(1, -1);\n          transform: scale(1, -1); }\n\n.fa-flip-horizontal.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(-1, -1);\n          transform: scale(-1, -1); }\n\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical {\n  -webkit-filter: none;\n          filter: none; }\n\n.fa-stack {\n  display: inline-block;\n  height: 2em;\n  position: relative;\n  width: 2em; }\n\n.fa-stack-1x,\n.fa-stack-2x {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0; }\n\n.svg-inline--fa.fa-stack-1x {\n  height: 1em;\n  width: 1em; }\n\n.svg-inline--fa.fa-stack-2x {\n  height: 2em;\n  width: 2em; }\n\n.fa-inverse {\n  color: #fff; }\n\n.sr-only {\n  border: 0;\n  clip: rect(0, 0, 0, 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px; }\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  clip: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  position: static;\n  width: auto; }\n";

var css = function css() {
  var dfp = DEFAULT_FAMILY_PREFIX;
  var drc = DEFAULT_REPLACEMENT_CLASS;
  var fp = config$1.familyPrefix;
  var rc = config$1.replacementClass;
  var s = baseStyles;

  if (fp !== dfp || rc !== drc) {
    var dPatt = new RegExp('\\.' + dfp + '\\-', 'g');
    var rPatt = new RegExp('\\.' + drc, 'g');

    s = s.replace(dPatt, '.' + fp + '-').replace(rPatt, '.' + rc);
  }

  return s;
};

function define(prefix, icons) {
  var normalized = Object.keys(icons).reduce(function (acc, iconName) {
    var icon = icons[iconName];
    var expanded = !!icon.icon;

    if (expanded) {
      acc[icon.iconName] = icon.icon;
    } else {
      acc[iconName] = icon;
    }
    return acc;
  }, {});

  if (typeof namespace.hooks.addPack === 'function') {
    namespace.hooks.addPack(prefix, normalized);
  } else {
    namespace.styles[prefix] = _extends({}, namespace.styles[prefix] || {}, normalized);
  }

  /**
   * Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
   * of new styles we needed to differentiate between them. Prefix `fa` is now an alias
   * for `fas` so we'll easy the upgrade process for our users by automatically defining
   * this as well.
   */
  if (prefix === 'fas') {
    define('fa', icons);
  }
}

var Library = function () {
  function Library() {
    classCallCheck(this, Library);

    this.definitions = {};
  }

  createClass(Library, [{
    key: 'add',
    value: function add() {
      var _this = this;

      for (var _len = arguments.length, definitions = Array(_len), _key = 0; _key < _len; _key++) {
        definitions[_key] = arguments[_key];
      }

      var additions = definitions.reduce(this._pullDefinitions, {});

      Object.keys(additions).forEach(function (key) {
        _this.definitions[key] = _extends({}, _this.definitions[key] || {}, additions[key]);
        define(key, additions[key]);
      });
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.definitions = {};
    }
  }, {
    key: '_pullDefinitions',
    value: function _pullDefinitions(additions, definition) {
      var normalized = definition.prefix && definition.iconName && definition.icon ? { 0: definition } : definition;

      Object.keys(normalized).map(function (key) {
        var _normalized$key = normalized[key],
            prefix = _normalized$key.prefix,
            iconName = _normalized$key.iconName,
            icon = _normalized$key.icon;

        if (!additions[prefix]) additions[prefix] = {};

        additions[prefix][iconName] = icon;
      });

      return additions;
    }
  }]);
  return Library;
}();

function prepIcon(icon) {
  var width = icon[0];
  var height = icon[1];
  var vectorData = icon.slice(4);

  return {
    found: true,
    width: width,
    height: height,
    icon: { tag: 'path', attributes: { fill: 'currentColor', d: vectorData[0] } }
  };
}

var _cssInserted = false;

function ensureCss() {
  if (!config$1.autoAddCss) {
    return;
  }

  if (!_cssInserted) {
    insertCss(css());
  }

  _cssInserted = true;
}

function apiObject(val, abstractCreator) {
  Object.defineProperty(val, 'abstract', {
    get: abstractCreator
  });

  Object.defineProperty(val, 'html', {
    get: function get() {
      return val.abstract.map(function (a) {
        return toHtml(a);
      });
    }
  });

  Object.defineProperty(val, 'node', {
    get: function get() {
      if (!IS_DOM) return;

      var container = DOCUMENT.createElement('div');
      container.innerHTML = val.html;
      return container.children;
    }
  });

  return val;
}

function findIconDefinition(params) {
  var _params$prefix = params.prefix,
      prefix = _params$prefix === undefined ? 'fa' : _params$prefix,
      iconName = params.iconName;

  if (!iconName) return;

  return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
}

function resolveIcons(next) {
  return function (maybeIconDefinition) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});

    var mask = params.mask;

    if (mask) {
      mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
    }

    return next(iconDefinition, _extends({}, params, { mask: mask }));
  };
}

var library = new Library();

var noAuto = function noAuto() {
  auto(false);
  disconnect();
};

var dom = {
  i2svg: function i2svg() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (IS_DOM) {
      ensureCss();

      var _params$node = params.node,
          node = _params$node === undefined ? DOCUMENT : _params$node,
          _params$callback = params.callback,
          callback = _params$callback === undefined ? function () {} : _params$callback;

      if (config$1.searchPseudoElements) {
        searchPseudoElements(node);
      }

      onTree(node, callback);
    }
  },

  css: css,

  insertCss: function insertCss$$1() {
    insertCss(css());
  }
};

var parse = {
  transform: function transform(transformString) {
    return parseTransformString(transformString);
  }
};

var index_es_icon = resolveIcons(function (iconDefinition) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _params$transform = params.transform,
      transform = _params$transform === undefined ? meaninglessTransform : _params$transform,
      _params$symbol = params.symbol,
      symbol = _params$symbol === undefined ? false : _params$symbol,
      _params$mask = params.mask,
      mask = _params$mask === undefined ? null : _params$mask,
      _params$title = params.title,
      title = _params$title === undefined ? null : _params$title,
      _params$classes = params.classes,
      classes = _params$classes === undefined ? [] : _params$classes,
      _params$attributes = params.attributes,
      attributes = _params$attributes === undefined ? {} : _params$attributes,
      _params$styles = params.styles,
      styles = _params$styles === undefined ? {} : _params$styles;

  if (!iconDefinition) return;

  var prefix = iconDefinition.prefix,
      iconName = iconDefinition.iconName,
      icon = iconDefinition.icon;

  return apiObject(_extends({ type: 'icon' }, iconDefinition), function () {
    ensureCss();

    if (config$1.autoA11y) {
      if (title) {
        attributes['aria-labelledby'] = config$1.replacementClass + '-title-' + nextUniqueId();
      } else {
        attributes['aria-hidden'] = 'true';
      }
    }

    return makeInlineSvgAbstract({
      icons: {
        main: prepIcon(icon),
        mask: mask ? prepIcon(mask.icon) : { found: false, width: null, height: null, icon: {} }
      },
      prefix: prefix,
      iconName: iconName,
      transform: _extends({}, meaninglessTransform, transform),
      symbol: symbol,
      title: title,
      extra: {
        attributes: attributes,
        styles: styles,
        classes: classes
      }
    });
  });
});

var index_es_text = function text(content) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _params$transform2 = params.transform,
      transform = _params$transform2 === undefined ? meaninglessTransform : _params$transform2,
      _params$title2 = params.title,
      title = _params$title2 === undefined ? null : _params$title2,
      _params$classes2 = params.classes,
      classes = _params$classes2 === undefined ? [] : _params$classes2,
      _params$attributes2 = params.attributes,
      attributes = _params$attributes2 === undefined ? {} : _params$attributes2,
      _params$styles2 = params.styles,
      styles = _params$styles2 === undefined ? {} : _params$styles2;

  return apiObject({ type: 'text', content: content }, function () {
    ensureCss();

    return makeLayersTextAbstract({
      content: content,
      transform: _extends({}, meaninglessTransform, transform),
      title: title,
      extra: {
        attributes: attributes,
        styles: styles,
        classes: [config$1.familyPrefix + '-layers-text'].concat(toConsumableArray(classes))
      }
    });
  });
};

var index_es_layer = function layer(assembler) {
  return apiObject({ type: 'layer' }, function () {
    ensureCss();

    var children = [];

    assembler(function (args) {
      Array.isArray(args) ? args.map(function (a) {
        children = children.concat(a.abstract);
      }) : children = children.concat(args.abstract);
    });

    return [{
      tag: 'span',
      attributes: { class: config$1.familyPrefix + '-layers' },
      children: children
    }];
  });
};

var api$1 = {
  noAuto: noAuto,
  dom: dom,
  library: library,
  parse: parse,
  findIconDefinition: findIconDefinition,
  icon: index_es_icon,
  text: index_es_text,
  layer: index_es_layer
};

var autoReplace = function autoReplace() {
  if (IS_DOM && config$1.autoReplaceSvg) api$1.dom.i2svg({ node: DOCUMENT });
};

function bootstrap() {
  if (IS_BROWSER) {
    if (!WINDOW.FontAwesome) {
      WINDOW.FontAwesome = api$1;
    }

    domready(function () {
      if (Object.keys(namespace.styles).length > 0) {
        autoReplace();
      }

      if (config$1.observeMutations && typeof MutationObserver === 'function') {
        observe({
          treeCallback: onTree,
          nodeCallback: onNode,
          pseudoElementsCallback: searchPseudoElements
        });
      }
    });
  }

  namespace.hooks = _extends({}, namespace.hooks, {

    addPack: function addPack(prefix, icons) {
      namespace.styles[prefix] = _extends({}, namespace.styles[prefix] || {}, icons);

      build();
      autoReplace();
    },

    addShims: function addShims(shims) {
      var _namespace$shims;

      (_namespace$shims = namespace.shims).push.apply(_namespace$shims, toConsumableArray(shims));

      build();
      autoReplace();
    }
  });
}

Object.defineProperty(api$1, 'config', {
  get: function get() {
    return config$1;
  },

  set: function set(newConfig) {
    update(newConfig);
  }
});

if (IS_DOM) bunker(bootstrap);

var config = api$1.config;


/* harmony default export */ var index_es = (api$1);
// EXTERNAL MODULE: ../node_modules/prop-types/index.js
var prop_types = __webpack_require__("5D9O");
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);

// CONCATENATED MODULE: ../node_modules/preact-compat/dist/preact-compat.es.js



var version = '15.1.0'; // trick libraries to think we are react

var ELEMENTS = 'a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr circle clipPath defs ellipse g image line linearGradient mask path pattern polygon polyline radialGradient rect stop svg text tspan'.split(' ');

var REACT_ELEMENT_TYPE = typeof Symbol !== 'undefined' && Symbol.for && Symbol.for('react.element') || 0xeac7;

var COMPONENT_WRAPPER_KEY = typeof Symbol !== 'undefined' && Symbol.for ? Symbol.for('__preactCompatWrapper') : '__preactCompatWrapper';

// don't autobind these methods since they already have guaranteed context.
var AUTOBIND_BLACKLIST = {
	constructor: 1,
	render: 1,
	shouldComponentUpdate: 1,
	componentWillReceiveProps: 1,
	componentWillUpdate: 1,
	componentDidUpdate: 1,
	componentWillMount: 1,
	componentDidMount: 1,
	componentWillUnmount: 1,
	componentDidUnmount: 1
};

var CAMEL_PROPS = /^(?:accent|alignment|arabic|baseline|cap|clip|color|fill|flood|font|glyph|horiz|marker|overline|paint|stop|strikethrough|stroke|text|underline|unicode|units|v|vector|vert|word|writing|x)[A-Z]/;

var BYPASS_HOOK = {};

/*global process*/
var DEV = typeof process === 'undefined' || !process.env || "production" !== 'production';

// a component that renders nothing. Used to replace components for unmountComponentAtNode.
function EmptyComponent() {
	return null;
}

// make react think we're react.
var VNode = Object(preact_min["h"])('a', null).constructor;
VNode.prototype.$$typeof = REACT_ELEMENT_TYPE;
VNode.prototype.preactCompatUpgraded = false;
VNode.prototype.preactCompatNormalized = false;

Object.defineProperty(VNode.prototype, 'type', {
	get: function get() {
		return this.nodeName;
	},
	set: function set(v) {
		this.nodeName = v;
	},
	configurable: true
});

Object.defineProperty(VNode.prototype, 'props', {
	get: function get() {
		return this.attributes;
	},
	set: function set(v) {
		this.attributes = v;
	},
	configurable: true
});

var oldEventHook = preact_min["options"].event;
preact_min["options"].event = function (e) {
	if (oldEventHook) {
		e = oldEventHook(e);
	}
	e.persist = Object;
	e.nativeEvent = e;
	return e;
};

var oldVnodeHook = preact_min["options"].vnode;
preact_min["options"].vnode = function (vnode) {
	if (!vnode.preactCompatUpgraded) {
		vnode.preactCompatUpgraded = true;

		var tag = vnode.nodeName,
		    attrs = vnode.attributes = extend({}, vnode.attributes);

		if (typeof tag === 'function') {
			if (tag[COMPONENT_WRAPPER_KEY] === true || tag.prototype && 'isReactComponent' in tag.prototype) {
				if (vnode.children && String(vnode.children) === '') {
					vnode.children = undefined;
				}
				if (vnode.children) {
					attrs.children = vnode.children;
				}

				if (!vnode.preactCompatNormalized) {
					normalizeVNode(vnode);
				}
				handleComponentVNode(vnode);
			}
		} else {
			if (vnode.children && String(vnode.children) === '') {
				vnode.children = undefined;
			}
			if (vnode.children) {
				attrs.children = vnode.children;
			}

			if (attrs.defaultValue) {
				if (!attrs.value && attrs.value !== 0) {
					attrs.value = attrs.defaultValue;
				}
				delete attrs.defaultValue;
			}

			handleElementVNode(vnode, attrs);
		}
	}

	if (oldVnodeHook) {
		oldVnodeHook(vnode);
	}
};

function handleComponentVNode(vnode) {
	var tag = vnode.nodeName,
	    a = vnode.attributes;

	vnode.attributes = {};
	if (tag.defaultProps) {
		extend(vnode.attributes, tag.defaultProps);
	}
	if (a) {
		extend(vnode.attributes, a);
	}
}

function handleElementVNode(vnode, a) {
	var shouldSanitize, attrs, i;
	if (a) {
		for (i in a) {
			if (shouldSanitize = CAMEL_PROPS.test(i)) {
				break;
			}
		}
		if (shouldSanitize) {
			attrs = vnode.attributes = {};
			for (i in a) {
				if (a.hasOwnProperty(i)) {
					attrs[CAMEL_PROPS.test(i) ? i.replace(/([A-Z0-9])/, '-$1').toLowerCase() : i] = a[i];
				}
			}
		}
	}
}

// proxy render() since React returns a Component reference.
function render$1(vnode, parent, callback) {
	var prev = parent && parent._preactCompatRendered && parent._preactCompatRendered.base;

	// ignore impossible previous renders
	if (prev && prev.parentNode !== parent) {
		prev = null;
	}

	// default to first Element child
	if (!prev && parent) {
		prev = parent.firstElementChild;
	}

	// remove unaffected siblings
	for (var i = parent.childNodes.length; i--;) {
		if (parent.childNodes[i] !== prev) {
			parent.removeChild(parent.childNodes[i]);
		}
	}

	var out = Object(preact_min["render"])(vnode, parent, prev);
	if (parent) {
		parent._preactCompatRendered = out && (out._component || { base: out });
	}
	if (typeof callback === 'function') {
		callback();
	}
	return out && out._component || out;
}

var ContextProvider = function ContextProvider() {};

ContextProvider.prototype.getChildContext = function () {
	return this.props.context;
};
ContextProvider.prototype.render = function (props) {
	return props.children[0];
};

function renderSubtreeIntoContainer(parentComponent, vnode, container, callback) {
	var wrap = Object(preact_min["h"])(ContextProvider, { context: parentComponent.context }, vnode);
	var renderContainer = render$1(wrap, container);
	var component = renderContainer._component || renderContainer.base;
	if (callback) {
		callback.call(component, renderContainer);
	}
	return component;
}

function unmountComponentAtNode(container) {
	var existing = container._preactCompatRendered && container._preactCompatRendered.base;
	if (existing && existing.parentNode === container) {
		Object(preact_min["render"])(Object(preact_min["h"])(EmptyComponent), container, existing);
		return true;
	}
	return false;
}

var ARR = [];

// This API is completely unnecessary for Preact, so it's basically passthrough.
var Children = {
	map: function map(children, fn, ctx) {
		if (children == null) {
			return null;
		}
		children = Children.toArray(children);
		if (ctx && ctx !== children) {
			fn = fn.bind(ctx);
		}
		return children.map(fn);
	},
	forEach: function forEach(children, fn, ctx) {
		if (children == null) {
			return null;
		}
		children = Children.toArray(children);
		if (ctx && ctx !== children) {
			fn = fn.bind(ctx);
		}
		children.forEach(fn);
	},
	count: function count(children) {
		return children && children.length || 0;
	},
	only: function only(children) {
		children = Children.toArray(children);
		if (children.length !== 1) {
			throw new Error('Children.only() expects only one child.');
		}
		return children[0];
	},
	toArray: function toArray(children) {
		if (children == null) {
			return [];
		}
		return ARR.concat(children);
	}
};

/** Track current render() component for ref assignment */
var currentComponent;

function createFactory(type) {
	return createElement.bind(null, type);
}

var DOM = {};
for (var preact_compat_es_i = ELEMENTS.length; preact_compat_es_i--;) {
	DOM[ELEMENTS[preact_compat_es_i]] = createFactory(ELEMENTS[preact_compat_es_i]);
}

function upgradeToVNodes(arr, offset) {
	for (var i = offset || 0; i < arr.length; i++) {
		var obj = arr[i];
		if (Array.isArray(obj)) {
			upgradeToVNodes(obj);
		} else if (obj && typeof obj === 'object' && !isValidElement(obj) && (obj.props && obj.type || obj.attributes && obj.nodeName || obj.children)) {
			arr[i] = createElement(obj.type || obj.nodeName, obj.props || obj.attributes, obj.children);
		}
	}
}

function isStatelessComponent(c) {
	return typeof c === 'function' && !(c.prototype && c.prototype.render);
}

// wraps stateless functional components in a PropTypes validator
function wrapStatelessComponent(WrappedComponent) {
	return preact_compat_es_createClass({
		displayName: WrappedComponent.displayName || WrappedComponent.name,
		render: function render() {
			return WrappedComponent(this.props, this.context);
		}
	});
}

function statelessComponentHook(Ctor) {
	var Wrapped = Ctor[COMPONENT_WRAPPER_KEY];
	if (Wrapped) {
		return Wrapped === true ? Ctor : Wrapped;
	}

	Wrapped = wrapStatelessComponent(Ctor);

	Object.defineProperty(Wrapped, COMPONENT_WRAPPER_KEY, { configurable: true, value: true });
	Wrapped.displayName = Ctor.displayName;
	Wrapped.propTypes = Ctor.propTypes;
	Wrapped.defaultProps = Ctor.defaultProps;

	Object.defineProperty(Ctor, COMPONENT_WRAPPER_KEY, { configurable: true, value: Wrapped });

	return Wrapped;
}

function createElement() {
	var args = [],
	    len = arguments.length;
	while (len--) {
		args[len] = arguments[len];
	}upgradeToVNodes(args, 2);
	return normalizeVNode(preact_min["h"].apply(void 0, args));
}

function normalizeVNode(vnode) {
	vnode.preactCompatNormalized = true;

	applyClassName(vnode);

	if (isStatelessComponent(vnode.nodeName)) {
		vnode.nodeName = statelessComponentHook(vnode.nodeName);
	}

	var ref = vnode.attributes.ref,
	    type = ref && typeof ref;
	if (currentComponent && (type === 'string' || type === 'number')) {
		vnode.attributes.ref = createStringRefProxy(ref, currentComponent);
	}

	applyEventNormalization(vnode);

	return vnode;
}

function cloneElement$1(element, props) {
	var children = [],
	    len = arguments.length - 2;
	while (len-- > 0) {
		children[len] = arguments[len + 2];
	}if (!isValidElement(element)) {
		return element;
	}
	var elementProps = element.attributes || element.props;
	var node = Object(preact_min["h"])(element.nodeName || element.type, extend({}, elementProps), element.children || elementProps && elementProps.children);
	// Only provide the 3rd argument if needed.
	// Arguments 3+ overwrite element.children in preactCloneElement
	var cloneArgs = [node, props];
	if (children && children.length) {
		cloneArgs.push(children);
	} else if (props && props.children) {
		cloneArgs.push(props.children);
	}
	return normalizeVNode(preact_min["cloneElement"].apply(void 0, cloneArgs));
}

function isValidElement(element) {
	return element && (element instanceof VNode || element.$$typeof === REACT_ELEMENT_TYPE);
}

function createStringRefProxy(name, component) {
	return component._refProxies[name] || (component._refProxies[name] = function (resolved) {
		if (component && component.refs) {
			component.refs[name] = resolved;
			if (resolved === null) {
				delete component._refProxies[name];
				component = null;
			}
		}
	});
}

function applyEventNormalization(ref) {
	var nodeName = ref.nodeName;
	var attributes = ref.attributes;

	if (!attributes || typeof nodeName !== 'string') {
		return;
	}
	var props = {};
	for (var i in attributes) {
		props[i.toLowerCase()] = i;
	}
	if (props.ondoubleclick) {
		attributes.ondblclick = attributes[props.ondoubleclick];
		delete attributes[props.ondoubleclick];
	}
	// for *textual inputs* (incl textarea), normalize `onChange` -> `onInput`:
	if (props.onchange && (nodeName === 'textarea' || nodeName.toLowerCase() === 'input' && !/^fil|che|rad/i.test(attributes.type))) {
		var normalized = props.oninput || 'oninput';
		if (!attributes[normalized]) {
			attributes[normalized] = multihook([attributes[normalized], attributes[props.onchange]]);
			delete attributes[props.onchange];
		}
	}
}

function applyClassName(vnode) {
	var a = vnode.attributes || (vnode.attributes = {});
	classNameDescriptor.enumerable = 'className' in a;
	if (a.className) {
		a.class = a.className;
	}
	Object.defineProperty(a, 'className', classNameDescriptor);
}

var classNameDescriptor = {
	configurable: true,
	get: function get() {
		return this.class;
	},
	set: function set(v) {
		this.class = v;
	}
};

function extend(base, props) {
	var arguments$1 = arguments;

	for (var i = 1, obj = void 0; i < arguments.length; i++) {
		if (obj = arguments$1[i]) {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					base[key] = obj[key];
				}
			}
		}
	}
	return base;
}

function shallowDiffers(a, b) {
	for (var i in a) {
		if (!(i in b)) {
			return true;
		}
	}
	for (var i$1 in b) {
		if (a[i$1] !== b[i$1]) {
			return true;
		}
	}
	return false;
}

function findDOMNode(component) {
	return component && component.base || component;
}

function F() {}

function preact_compat_es_createClass(obj) {
	function cl(props, context) {
		bindAll(this);
		Component$1.call(this, props, context, BYPASS_HOOK);
		newComponentHook.call(this, props, context);
	}

	obj = extend({ constructor: cl }, obj);

	// We need to apply mixins here so that getDefaultProps is correctly mixed
	if (obj.mixins) {
		applyMixins(obj, collateMixins(obj.mixins));
	}
	if (obj.statics) {
		extend(cl, obj.statics);
	}
	if (obj.propTypes) {
		cl.propTypes = obj.propTypes;
	}
	if (obj.defaultProps) {
		cl.defaultProps = obj.defaultProps;
	}
	if (obj.getDefaultProps) {
		cl.defaultProps = obj.getDefaultProps.call(cl);
	}

	F.prototype = Component$1.prototype;
	cl.prototype = extend(new F(), obj);

	cl.displayName = obj.displayName || 'Component';

	return cl;
}

// Flatten an Array of mixins to a map of method name to mixin implementations
function collateMixins(mixins) {
	var keyed = {};
	for (var i = 0; i < mixins.length; i++) {
		var mixin = mixins[i];
		for (var key in mixin) {
			if (mixin.hasOwnProperty(key) && typeof mixin[key] === 'function') {
				(keyed[key] || (keyed[key] = [])).push(mixin[key]);
			}
		}
	}
	return keyed;
}

// apply a mapping of Arrays of mixin methods to a component prototype
function applyMixins(proto, mixins) {
	for (var key in mixins) {
		if (mixins.hasOwnProperty(key)) {
			proto[key] = multihook(mixins[key].concat(proto[key] || ARR), key === 'getDefaultProps' || key === 'getInitialState' || key === 'getChildContext');
		}
	}
}

function bindAll(ctx) {
	for (var i in ctx) {
		var v = ctx[i];
		if (typeof v === 'function' && !v.__bound && !AUTOBIND_BLACKLIST.hasOwnProperty(i)) {
			(ctx[i] = v.bind(ctx)).__bound = true;
		}
	}
}

function callMethod(ctx, m, args) {
	if (typeof m === 'string') {
		m = ctx.constructor.prototype[m];
	}
	if (typeof m === 'function') {
		return m.apply(ctx, args);
	}
}

function multihook(hooks, skipDuplicates) {
	return function () {
		var arguments$1 = arguments;
		var this$1 = this;

		var ret;
		for (var i = 0; i < hooks.length; i++) {
			var r = callMethod(this$1, hooks[i], arguments$1);

			if (skipDuplicates && r != null) {
				if (!ret) {
					ret = {};
				}
				for (var key in r) {
					if (r.hasOwnProperty(key)) {
						ret[key] = r[key];
					}
				}
			} else if (typeof r !== 'undefined') {
				ret = r;
			}
		}
		return ret;
	};
}

function newComponentHook(props, context) {
	propsHook.call(this, props, context);
	this.componentWillReceiveProps = multihook([propsHook, this.componentWillReceiveProps || 'componentWillReceiveProps']);
	this.render = multihook([propsHook, beforeRender, this.render || 'render', afterRender]);
}

function propsHook(props, context) {
	if (!props) {
		return;
	}

	// React annoyingly special-cases single children, and some react components are ridiculously strict about this.
	var c = props.children;
	if (c && Array.isArray(c) && c.length === 1 && (typeof c[0] === 'string' || typeof c[0] === 'function' || c[0] instanceof VNode)) {
		props.children = c[0];

		// but its totally still going to be an Array.
		if (props.children && typeof props.children === 'object') {
			props.children.length = 1;
			props.children[0] = props.children;
		}
	}

	// add proptype checking
	if (DEV) {
		var ctor = typeof this === 'function' ? this : this.constructor,
		    propTypes = this.propTypes || ctor.propTypes;
		var displayName = this.displayName || ctor.name;

		if (propTypes) {
			prop_types_default.a.checkPropTypes(propTypes, props, 'prop', displayName);
		}
	}
}

function beforeRender(props) {
	currentComponent = this;
}

function afterRender() {
	if (currentComponent === this) {
		currentComponent = null;
	}
}

function Component$1(props, context, opts) {
	preact_min["Component"].call(this, props, context);
	this.state = this.getInitialState ? this.getInitialState() : {};
	this.refs = {};
	this._refProxies = {};
	if (opts !== BYPASS_HOOK) {
		newComponentHook.call(this, props, context);
	}
}
extend(Component$1.prototype = new preact_min["Component"](), {
	constructor: Component$1,

	isReactComponent: {},

	replaceState: function replaceState(state, callback) {
		var this$1 = this;

		this.setState(state, callback);
		for (var i in this$1.state) {
			if (!(i in state)) {
				delete this$1.state[i];
			}
		}
	},

	getDOMNode: function getDOMNode() {
		return this.base;
	},

	isMounted: function isMounted() {
		return !!this.base;
	}
});

function PureComponent(props, context) {
	Component$1.call(this, props, context);
}
F.prototype = Component$1.prototype;
PureComponent.prototype = new F();
PureComponent.prototype.isPureReactComponent = true;
PureComponent.prototype.shouldComponentUpdate = function (props, state) {
	return shallowDiffers(this.props, props) || shallowDiffers(this.state, state);
};

var index = {
	version: version,
	DOM: DOM,
	PropTypes: prop_types_default.a,
	Children: Children,
	render: render$1,
	createClass: preact_compat_es_createClass,
	createFactory: createFactory,
	createElement: createElement,
	cloneElement: cloneElement$1,
	isValidElement: isValidElement,
	findDOMNode: findDOMNode,
	unmountComponentAtNode: unmountComponentAtNode,
	Component: Component$1,
	PureComponent: PureComponent,
	unstable_renderSubtreeIntoContainer: renderSubtreeIntoContainer,
	__spread: extend
};

/* harmony default export */ var preact_compat_es = (index);
//# sourceMappingURL=preact-compat.es.js.map
// CONCATENATED MODULE: ../node_modules/@fortawesome/react-fontawesome/index.es.js




var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
  return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var humps = createCommonjsModule(function (module) {
  // =========
  // = humps =
  // =========
  // Underscore-to-camelCase converter (and vice versa)
  // for strings and object keys

  // humps is copyright © 2012+ Dom Christie
  // Released under the MIT license.


  (function (global) {

    var _processKeys = function _processKeys(convert, obj, options) {
      if (!_isObject(obj) || _isDate(obj) || _isRegExp(obj) || _isBoolean(obj) || _isFunction(obj)) {
        return obj;
      }

      var output,
          i = 0,
          l = 0;

      if (_isArray(obj)) {
        output = [];
        for (l = obj.length; i < l; i++) {
          output.push(_processKeys(convert, obj[i], options));
        }
      } else {
        output = {};
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            output[convert(key, options)] = _processKeys(convert, obj[key], options);
          }
        }
      }
      return output;
    };

    // String conversion methods

    var separateWords = function separateWords(string, options) {
      options = options || {};
      var separator = options.separator || '_';
      var split = options.split || /(?=[A-Z])/;

      return string.split(split).join(separator);
    };

    var camelize = function camelize(string) {
      if (_isNumerical(string)) {
        return string;
      }
      string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
      // Ensure 1st char is always lowercase
      return string.substr(0, 1).toLowerCase() + string.substr(1);
    };

    var pascalize = function pascalize(string) {
      var camelized = camelize(string);
      // Ensure 1st char is always uppercase
      return camelized.substr(0, 1).toUpperCase() + camelized.substr(1);
    };

    var decamelize = function decamelize(string, options) {
      return separateWords(string, options).toLowerCase();
    };

    // Utilities
    // Taken from Underscore.js

    var toString = Object.prototype.toString;

    var _isFunction = function _isFunction(obj) {
      return typeof obj === 'function';
    };
    var _isObject = function _isObject(obj) {
      return obj === Object(obj);
    };
    var _isArray = function _isArray(obj) {
      return toString.call(obj) == '[object Array]';
    };
    var _isDate = function _isDate(obj) {
      return toString.call(obj) == '[object Date]';
    };
    var _isRegExp = function _isRegExp(obj) {
      return toString.call(obj) == '[object RegExp]';
    };
    var _isBoolean = function _isBoolean(obj) {
      return toString.call(obj) == '[object Boolean]';
    };

    // Performant way to determine if obj coerces to a number
    var _isNumerical = function _isNumerical(obj) {
      obj = obj - 0;
      return obj === obj;
    };

    // Sets up function which handles processing keys
    // allowing the convert function to be modified by a callback
    var _processor = function _processor(convert, options) {
      var callback = options && 'process' in options ? options.process : options;

      if (typeof callback !== 'function') {
        return convert;
      }

      return function (string, options) {
        return callback(string, convert, options);
      };
    };

    var humps = {
      camelize: camelize,
      decamelize: decamelize,
      pascalize: pascalize,
      depascalize: decamelize,
      camelizeKeys: function camelizeKeys(object, options) {
        return _processKeys(_processor(camelize, options), object);
      },
      decamelizeKeys: function decamelizeKeys(object, options) {
        return _processKeys(_processor(decamelize, options), object, options);
      },
      pascalizeKeys: function pascalizeKeys(object, options) {
        return _processKeys(_processor(pascalize, options), object);
      },
      depascalizeKeys: function depascalizeKeys() {
        return this.decamelizeKeys.apply(this, arguments);
      }
    };

    if (false) {
      undefined(humps);
    } else if ('object' !== 'undefined' && module.exports) {
      module.exports = humps;
    } else {
      global.humps = humps;
    }
  })(commonjsGlobal);
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function wrap(fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function _await(value) {
      return new AwaitValue(value);
    }
  };
}();

var defineProperty = function defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var index_es__extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var objectWithoutProperties = function objectWithoutProperties(obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var index_es_toConsumableArray = function toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
};

function capitalize(val) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

function styleToObject(style) {
  return style.split(';').map(function (s) {
    return s.trim();
  }).filter(function (s) {
    return s;
  }).reduce(function (acc, pair) {
    var i = pair.indexOf(':');
    var prop = humps.camelize(pair.slice(0, i));
    var value = pair.slice(i + 1).trim();

    prop.startsWith('webkit') ? acc[capitalize(prop)] = value : acc[prop] = value;

    return acc;
  }, {});
}

function convert(createElement, element) {
  var extraProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var children = (element.children || []).map(convert.bind(null, createElement));

  var mixins = Object.keys(element.attributes || {}).reduce(function (acc, key) {
    var val = element.attributes[key];

    switch (key) {
      case 'class':
        acc.attrs['className'] = val;
        delete element.attributes['class'];
        break;
      case 'style':
        acc.attrs['style'] = styleToObject(val);
        break;
      default:
        if (key.indexOf('aria-') === 0 || key.indexOf('data-') === 0) {
          acc.attrs[key.toLowerCase()] = val;
        } else {
          acc.attrs[humps.camelize(key)] = val;
        }
    }

    return acc;
  }, { attrs: {} });

  var _extraProps$style = extraProps.style,
      existingStyle = _extraProps$style === undefined ? {} : _extraProps$style,
      remaining = objectWithoutProperties(extraProps, ['style']);

  mixins.attrs['style'] = index_es__extends({}, mixins.attrs['style'], existingStyle);

  return createElement.apply(undefined, [element.tag, index_es__extends({}, mixins.attrs, remaining)].concat(index_es_toConsumableArray(children)));
}

var index_es_PRODUCTION = false;

try {
  index_es_PRODUCTION = "production" === 'production';
} catch (e) {}

var log = function log() {
  if (!index_es_PRODUCTION && console && typeof console.error === 'function') {
    var _console;

    (_console = console).error.apply(_console, arguments);
  }
};

function objectWithKey(key, value) {
  return Array.isArray(value) && value.length > 0 || !Array.isArray(value) && value ? defineProperty({}, key, value) : {};
}

function classList(props) {
  var _classes;

  var classes = (_classes = {
    'fa-spin': props.spin,
    'fa-pulse': props.pulse,
    'fa-fw': props.fixedWidth,
    'fa-border': props.border,
    'fa-li': props.listItem,
    'fa-flip-horizontal': props.flip === 'horizontal' || props.flip === 'both',
    'fa-flip-vertical': props.flip === 'vertical' || props.flip === 'both'
  }, defineProperty(_classes, 'fa-' + props.size, props.size !== null), defineProperty(_classes, 'fa-rotate-' + props.rotation, props.rotation !== null), defineProperty(_classes, 'fa-pull-' + props.pull, props.pull !== null), _classes);

  return Object.keys(classes).map(function (key) {
    return classes[key] ? key : null;
  }).filter(function (key) {
    return key;
  });
}

function normalizeIconArgs(icon) {
  if (icon === null) {
    return null;
  }

  if ((typeof icon === 'undefined' ? 'undefined' : _typeof(icon)) === 'object' && icon.prefix && icon.iconName) {
    return icon;
  }

  if (Array.isArray(icon) && icon.length === 2) {
    return { prefix: icon[0], iconName: icon[1] };
  }

  if (typeof icon === 'string') {
    return { prefix: 'fas', iconName: icon };
  }
}

function FontAwesomeIcon$1(props) {
  var iconArgs = props.icon,
      maskArgs = props.mask,
      symbol = props.symbol,
      className = props.className;

  var icon = normalizeIconArgs(iconArgs);
  var classes = objectWithKey('classes', [].concat(index_es_toConsumableArray(classList(props)), index_es_toConsumableArray(className.split(' '))));
  var transform = objectWithKey('transform', typeof props.transform === 'string' ? index_es.parse.transform(props.transform) : props.transform);
  var mask = objectWithKey('mask', normalizeIconArgs(maskArgs));

  var renderedIcon = index_es.icon(icon, index_es__extends({}, classes, transform, mask, {
    symbol: symbol
  }));

  if (!renderedIcon) {
    log('Could not find icon', icon);
    return null;
  }

  var abstract = renderedIcon.abstract;

  var convertCurry = convert.bind(null, preact_compat_es.createElement);
  var extraProps = {};

  Object.keys(props).forEach(function (key) {
    if (!FontAwesomeIcon$1.defaultProps.hasOwnProperty(key)) extraProps[key] = props[key];
  });

  return convertCurry(abstract[0], extraProps);
}

FontAwesomeIcon$1.propTypes = {
  border: prop_types_default.a.bool,

  className: prop_types_default.a.string,

  mask: prop_types_default.a.oneOfType([prop_types_default.a.object, prop_types_default.a.array, prop_types_default.a.string]),

  fixedWidth: prop_types_default.a.bool,

  flip: prop_types_default.a.oneOf(['horizontal', 'vertical', 'both']),

  icon: prop_types_default.a.oneOfType([prop_types_default.a.object, prop_types_default.a.array, prop_types_default.a.string]),

  listItem: prop_types_default.a.bool,

  pull: prop_types_default.a.oneOf(['right', 'left']),

  pulse: prop_types_default.a.bool,

  name: prop_types_default.a.string,

  rotation: prop_types_default.a.oneOf([90, 180, 270]),

  size: prop_types_default.a.oneOf(['lg', 'xs', 'sm', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x']),

  spin: prop_types_default.a.bool,

  symbol: prop_types_default.a.oneOfType([prop_types_default.a.bool, prop_types_default.a.string]),

  transform: prop_types_default.a.oneOfType([prop_types_default.a.string, prop_types_default.a.object])
};

FontAwesomeIcon$1.defaultProps = {
  border: false,
  className: '',
  mask: null,
  fixedWidth: false,
  flip: null,
  icon: null,
  listItem: false,
  pull: null,
  pulse: false,
  name: '',
  rotation: null,
  size: null,
  spin: false,
  symbol: false,
  transform: null
};

index_es.noAuto();

/* harmony default export */ var react_fontawesome_index_es = (FontAwesomeIcon$1);
// EXTERNAL MODULE: ../node_modules/@fortawesome/fontawesome-free-solid/faPlus.js
var faPlus = __webpack_require__("0wwn");
var faPlus_default = /*#__PURE__*/__webpack_require__.n(faPlus);

// EXTERNAL MODULE: ../node_modules/@fortawesome/fontawesome-free-solid/faMusic.js
var faMusic = __webpack_require__("YHt5");
var faMusic_default = /*#__PURE__*/__webpack_require__.n(faMusic);

// EXTERNAL MODULE: ../node_modules/@fortawesome/fontawesome-free-solid/faLocationArrow.js
var faLocationArrow = __webpack_require__("KEvG");
var faLocationArrow_default = /*#__PURE__*/__webpack_require__.n(faLocationArrow);

// CONCATENATED MODULE: ./components/app/home/sound/AddSound.js


function AddSound__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function AddSound__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function AddSound__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }








var AddSound__ref = Object(preact_min["h"])(
  'span',
  { 'class': 'icon is-small is-left' },
  Object(preact_min["h"])(react_fontawesome_index_es, { icon: faMusic_default.a })
);

var AddSound__ref2 = Object(preact_min["h"])(
  'span',
  { 'class': 'icon is-small is-left' },
  Object(preact_min["h"])(react_fontawesome_index_es, { icon: faLocationArrow_default.a })
);

var AddSound__ref3 = Object(preact_min["h"])(
  'div',
  { 'class': 'field is-grouped is-grouped-right' },
  Object(preact_min["h"])(
    'div',
    { 'class': 'control' },
    Object(preact_min["h"])(
      'button',
      { 'class': 'button is-secondary',
        type: 'submit' },
      Object(preact_min["h"])(
        'span',
        { 'class': 'icon' },
        Object(preact_min["h"])(react_fontawesome_index_es, { icon: faPlus_default.a })
      )
    )
  )
);

var AddSound_AddSound = function (_Component) {
  AddSound__inherits(AddSound, _Component);

  function AddSound(props) {
    AddSound__classCallCheck(this, AddSound);

    var _this = AddSound__possibleConstructorReturn(this, _Component.call(this, props));

    _this.handleSubmit = function (e) {
      e.preventDefault();
      _this.props.onAddSound(_this.state.sound, _this.state.url);
      _this.setState({ sound: null, url: null });
    };

    _this.state = { sound: null, url: null };
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  AddSound.prototype.render = function render(props, state) {
    return Object(preact_min["h"])(
      'form',
      { onSubmit: this.handleSubmit },
      Object(preact_min["h"])(
        'div',
        { 'class': 'field' },
        Object(preact_min["h"])(
          'div',
          { 'class': 'control has-icons-left' },
          Object(preact_min["h"])('input', { type: 'text',
            'class': 'input',
            placeholder: 'Name',
            value: state.sound,
            onChange: linkstate_es(this, 'sound'),
            required: true }),
          AddSound__ref
        )
      ),
      Object(preact_min["h"])(
        'div',
        { 'class': 'field' },
        Object(preact_min["h"])(
          'div',
          { 'class': 'control has-icons-left is-expanded' },
          Object(preact_min["h"])('input', { type: 'url',
            'class': 'input',
            placeholder: 'File URL',
            value: state.url,
            onChange: linkstate_es(this, 'url'),
            required: true }),
          AddSound__ref2
        )
      ),
      AddSound__ref3
    );
  };

  return AddSound;
}(preact_min["Component"]);


// EXTERNAL MODULE: ../node_modules/@fortawesome/fontawesome-free-solid/faLink.js
var faLink = __webpack_require__("OKRy");
var faLink_default = /*#__PURE__*/__webpack_require__.n(faLink);

// EXTERNAL MODULE: ../node_modules/@fortawesome/fontawesome-free-solid/faPlay.js
var faPlay = __webpack_require__("vie6");
var faPlay_default = /*#__PURE__*/__webpack_require__.n(faPlay);

// EXTERNAL MODULE: ../node_modules/@fortawesome/fontawesome-free-solid/faTrashAlt.js
var faTrashAlt = __webpack_require__("XNXn");
var faTrashAlt_default = /*#__PURE__*/__webpack_require__.n(faTrashAlt);

// CONCATENATED MODULE: ./components/app/home/sound/SoundsList.js


function SoundsList__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function SoundsList__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function SoundsList__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }









var SoundsList__ref = Object(preact_min["h"])(
	'span',
	{ 'class': 'icon' },
	Object(preact_min["h"])(react_fontawesome_index_es, { icon: faPlay_default.a })
);

var SoundsList__ref2 = Object(preact_min["h"])(
	'span',
	{ 'class': 'icon' },
	Object(preact_min["h"])(react_fontawesome_index_es, { icon: faLink_default.a })
);

var SoundsList__ref3 = Object(preact_min["h"])(
	'span',
	{ 'class': 'icon' },
	Object(preact_min["h"])(react_fontawesome_index_es, { icon: faTrashAlt_default.a })
);

var SoundsList_SoundsList = function (_Component) {
	SoundsList__inherits(SoundsList, _Component);

	function SoundsList(props) {
		SoundsList__classCallCheck(this, SoundsList);

		var _this = SoundsList__possibleConstructorReturn(this, _Component.call(this, props));

		_this.play = function (e) {
			return _this.props.play(e.currentTarget.value);
		};

		_this.remove = function (e) {
			return _this.props.remove(e.currentTarget.value);
		};

		_this.showAddress = function (e) {
			var url = window.location.origin + '/api/sounds/' + e.currentTarget.value;
			event_emitter.emit('DISPLAY_MESSAGE', url);
		};

		_this.state = { soundAddress: null };
		_this.play = _this.play.bind(_this);
		_this.remove = _this.remove.bind(_this);
		_this.showAddress = _this.showAddress.bind(_this);
		return _this;
	}

	SoundsList.prototype.render = function render(props) {
		var _this2 = this;

		return Object(preact_min["h"])(
			'div',
			null,
			Object(preact_min["h"])(
				'table',
				{ 'class': 'table is-striped is-hoverable is-fullwidth' },
				Object(preact_min["h"])(
					'tbody',
					null,
					props.sounds.map(function (sound) {
						return Object(preact_min["h"])(
							'tr',
							null,
							Object(preact_min["h"])(
								'td',
								null,
								sound
							),
							Object(preact_min["h"])(
								'td',
								{ 'class': 'has-text-right', style: 'width: 30px;' },
								Object(preact_min["h"])(
									'button',
									{
										'class': 'button is-secondary is-small',
										value: sound,
										onClick: _this2.play },
									SoundsList__ref
								)
							),
							Object(preact_min["h"])(
								'td',
								{ 'class': 'has-text-right', style: 'width: 30px;' },
								Object(preact_min["h"])(
									'button',
									{ 'class': 'button is-info is-small',
										value: sound,
										onClick: _this2.showAddress },
									SoundsList__ref2
								)
							),
							Object(preact_min["h"])(
								'td',
								{ 'class': 'has-text-right', style: 'width: 30px;' },
								Object(preact_min["h"])(
									'button',
									{ 'class': 'button is-danger is-small',
										value: sound,
										onClick: _this2.remove },
									SoundsList__ref3
								)
							)
						);
					})
				)
			)
		);
	};

	return SoundsList;
}(preact_min["Component"]);


// EXTERNAL MODULE: ../node_modules/@fortawesome/fontawesome-free-solid/faBullhorn.js
var faBullhorn = __webpack_require__("60rz");
var faBullhorn_default = /*#__PURE__*/__webpack_require__.n(faBullhorn);

// CONCATENATED MODULE: ./components/app/home/speech/Speak.js


function Speak__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Speak__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function Speak__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }







var Speak__ref = Object(preact_min["h"])(
  'span',
  { 'class': 'icon is-small is-left' },
  Object(preact_min["h"])(react_fontawesome_index_es, { icon: faBullhorn_default.a })
);

var Speak__ref2 = Object(preact_min["h"])(
  'div',
  { 'class': 'control' },
  Object(preact_min["h"])(
    'button',
    { 'class': 'button is-secondary', type: 'submit' },
    Object(preact_min["h"])(
      'span',
      { 'class': 'icon' },
      Object(preact_min["h"])(react_fontawesome_index_es, { icon: faPlay_default.a })
    )
  )
);

var Speak_Speak = function (_Component) {
  Speak__inherits(Speak, _Component);

  function Speak(props) {
    Speak__classCallCheck(this, Speak);

    var _this = Speak__possibleConstructorReturn(this, _Component.call(this, props));

    _this.handleSubmit = function (e) {
      e.preventDefault();
      _this.props.onSpeak(_this.state.speech);
      _this.setState({ speech: null });
    };

    _this.state = { speech: null };
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  Speak.prototype.render = function render(props, state) {
    return Object(preact_min["h"])(
      'form',
      { onSubmit: this.handleSubmit },
      Object(preact_min["h"])(
        'div',
        { 'class': 'field has-addons' },
        Object(preact_min["h"])(
          'div',
          { 'class': 'control has-icons-left is-expanded' },
          Object(preact_min["h"])('input', { type: 'text',
            'class': 'input',
            placeholder: 'Say something...',
            value: state.speech,
            onChange: linkstate_es(this, 'speech'),
            required: true }),
          Speak__ref
        ),
        Speak__ref2
      )
    );
  };

  return Speak;
}(preact_min["Component"]);


// EXTERNAL MODULE: ../node_modules/@fortawesome/fontawesome-free-solid/faKey.js
var faKey = __webpack_require__("8A/K");
var faKey_default = /*#__PURE__*/__webpack_require__.n(faKey);

// CONCATENATED MODULE: ./components/app/home/token/GenerateToken.js


function GenerateToken__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function GenerateToken__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function GenerateToken__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var GenerateToken__ref = Object(preact_min["h"])(
  'span',
  { 'class': 'icon' },
  Object(preact_min["h"])(react_fontawesome_index_es, { icon: faKey_default.a })
);

var GenerateToken__ref2 = Object(preact_min["h"])(
  'span',
  null,
  'Generate'
);

var GenerateToken_Speak = function (_Component) {
  GenerateToken__inherits(Speak, _Component);

  function Speak(props) {
    GenerateToken__classCallCheck(this, Speak);

    var _this = GenerateToken__possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = { generating: false };
    _this.generate = _this.generate.bind(_this);
    return _this;
  }

  Speak.prototype.generate = function generate() {
    var _this2 = this;

    this.setState({ generating: true });
    this.props.onGenerate().then(function () {
      return _this2.setState({ generating: false });
    });
  };

  Speak.prototype.render = function render(props, state) {
    var isLoading = state.generating ? 'is-loading' : '';
    return Object(preact_min["h"])(
      'a',
      { 'class': 'button is-medium is-danger is-flex ' + isLoading,
        onClick: this.generate },
      GenerateToken__ref,
      GenerateToken__ref2
    );
  };

  return Speak;
}(preact_min["Component"]);


// EXTERNAL MODULE: ../node_modules/axios/index.js
var axios = __webpack_require__("dZBD");
var axios_default = /*#__PURE__*/__webpack_require__.n(axios);

// EXTERNAL MODULE: ./services/auth.js
var auth = __webpack_require__("PEzW");
var auth_default = /*#__PURE__*/__webpack_require__.n(auth);

// CONCATENATED MODULE: ./services/api.js




var api_headers = function headers() {
	return { Authorization: 'Bearer ' + Object(auth["getAccessToken"])() };
};

var api_unauthorized = function unauthorized(err) {
	if (err.response && err.response.status === 401) {
		event_emitter.emit('UNAUTHORIZED');
	}
	throw err;
};

var api_addSound = function addSound(soundName, url) {
	return Object(axios["post"])('/api/sounds', { soundName: soundName, url: url }, { headers: api_headers() }).catch(api_unauthorized);
};

var api_listSounds = function listSounds() {
	return Object(axios["get"])('/api/sounds', { headers: api_headers() }).then(function (response) {
		return response.data;
	}).catch(api_unauthorized);
};

var api_playSound = function playSound(sound) {
	return Object(axios["get"])('/api/sounds/' + sound, { headers: api_headers() }).catch(api_unauthorized);
};

var api_removeSound = function removeSound(sound) {
	return Object(axios["delete"])('/api/sounds/' + sound, { headers: api_headers() }).catch(api_unauthorized);
};

var api_speak = function speak(speech) {
	return Object(axios["post"])('/api/speech', { speech: speech }, { headers: api_headers() }).catch(api_unauthorized);
};

var api_generateToken = function generateToken() {
	return Object(axios["post"])('/api/tokens', null, { headers: api_headers() }).then(function (response) {
		return response.data;
	}).catch(api_unauthorized);
};
// CONCATENATED MODULE: ./components/app/Home.js


function Home__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Home__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function Home__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }









var Home__ref = Object(preact_min["h"])(
	'h1',
	{ 'class': 'subtitle has-text-centered' },
	'API Token'
);

var Home__ref2 = Object(preact_min["h"])(
	'h1',
	{ 'class': 'subtitle has-text-centered' },
	'Speech'
);

var Home__ref3 = Object(preact_min["h"])(
	'h1',
	{ 'class': 'subtitle has-text-centered' },
	'Sounds'
);

var Home__ref4 = Object(preact_min["h"])('hr', null);

var Home_Home = function (_Component) {
	Home__inherits(Home, _Component);

	function Home(props) {
		Home__classCallCheck(this, Home);

		var _this = Home__possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = { sounds: [] };
		_this.handleAddSound = _this.handleAddSound.bind(_this);
		_this.handlePlaySound = _this.handlePlaySound.bind(_this);
		_this.handleRemove = _this.handleRemove.bind(_this);
		_this.handleSpeak = _this.handleSpeak.bind(_this);
		_this.handleGenerateToken = _this.handleGenerateToken.bind(_this);
		return _this;
	}

	Home.prototype.componentDidMount = function componentDidMount() {
		var _this2 = this;

		api_listSounds().then(function (sounds) {
			return _this2.setState({ sounds: sounds });
		}).catch(function (error) {
			event_emitter.emit('DISPLAY_ERROR', 'Could not load sounds');
		});
	};

	Home.prototype.handleAddSound = function handleAddSound(sound, url) {
		var _this3 = this;

		api_addSound(sound, url).then(function () {
			return api_listSounds();
		}).then(function (sounds) {
			return _this3.setState({ sounds: sounds });
		}).catch(function (error) {
			event_emitter.emit('DISPLAY_ERROR', 'Could not add sound');
		});
	};

	Home.prototype.handlePlaySound = function handlePlaySound(sound) {
		api_playSound(sound).catch(function (error) {
			event_emitter.emit('DISPLAY_ERROR', 'Could not play sound');
		});
	};

	Home.prototype.handleRemove = function handleRemove(sound) {
		var _this4 = this;

		api_removeSound(sound).then(function () {
			return api_listSounds();
		}).then(function (sounds) {
			return _this4.setState({ sounds: sounds });
		}).catch(function (error) {
			event_emitter.emit('DISPLAY_ERROR', 'Could not remove sound');
		});
	};

	Home.prototype.handleSpeak = function handleSpeak(speech) {
		api_speak(speech).catch(function (error) {
			event_emitter.emit('DISPLAY_ERROR', 'Could not utter speech');
		});
	};

	Home.prototype.handleGenerateToken = function handleGenerateToken() {
		return api_generateToken().then(function (token) {
			event_emitter.emit('DISPLAY_MESSAGE', 'API Token: ' + token);
		}).catch(function (error) {
			event_emitter.emit('DISPLAY_ERROR', 'Could not generate API token');
		});
	};

	Home.prototype.render = function render(props, state) {
		return Object(preact_min["h"])(
			'article',
			null,
			Object(preact_min["h"])(
				'section',
				{ 'class': 'section' },
				Object(preact_min["h"])(
					'div',
					{ 'class': 'container' },
					Object(preact_min["h"])(
						'div',
						{ 'class': 'box' },
						Home__ref,
						Object(preact_min["h"])(GenerateToken_Speak, { onGenerate: this.handleGenerateToken })
					)
				)
			),
			Object(preact_min["h"])(
				'section',
				{ 'class': 'section' },
				Object(preact_min["h"])(
					'div',
					{ 'class': 'container' },
					Object(preact_min["h"])(
						'div',
						{ 'class': 'box' },
						Home__ref2,
						Object(preact_min["h"])(Speak_Speak, { onSpeak: this.handleSpeak })
					)
				)
			),
			Object(preact_min["h"])(
				'section',
				{ 'class': 'section' },
				Object(preact_min["h"])(
					'div',
					{ 'class': 'container' },
					Object(preact_min["h"])(
						'div',
						{ 'class': 'box' },
						Home__ref3,
						Object(preact_min["h"])(AddSound_AddSound, { onAddSound: this.handleAddSound }),
						Home__ref4,
						Object(preact_min["h"])(SoundsList_SoundsList, { sounds: state.sounds,
							play: this.handlePlaySound,
							remove: this.handleRemove })
					)
				)
			)
		);
	};

	return Home;
}(preact_min["Component"]);


;
// EXTERNAL MODULE: ../node_modules/@fortawesome/fontawesome-free-brands/faGithub.js
var faGithub = __webpack_require__("I69a");
var faGithub_default = /*#__PURE__*/__webpack_require__.n(faGithub);

// CONCATENATED MODULE: ./components/app/Login.js


function Login__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Login__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function Login__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var Login__ref = Object(preact_min["h"])(
	'h1',
	{ 'class': 'subtitle has-text-centered' },
	'Sign in'
);

var Login__ref2 = Object(preact_min["h"])(
	'span',
	{ 'class': 'icon' },
	Object(preact_min["h"])(react_fontawesome_index_es, { icon: faGithub_default.a })
);

var Login__ref3 = Object(preact_min["h"])(
	'span',
	null,
	'GitHub'
);

var Login_Login = function (_Component) {
	Login__inherits(Login, _Component);

	function Login(props) {
		Login__classCallCheck(this, Login);

		var _this = Login__possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = { logginIn: false };
		_this.toogleLogginIn = _this.toogleLogginIn.bind(_this);
		return _this;
	}

	Login.prototype.toogleLogginIn = function toogleLogginIn() {
		this.setState({ logginIn: !this.state.logginIn });
	};

	Login.prototype.render = function render(props, state) {
		var isLoading = state.logginIn ? 'is-loading' : '';
		return Object(preact_min["h"])(
			'section',
			{ 'class': 'section' },
			Object(preact_min["h"])(
				'div',
				{ 'class': 'columns' },
				Object(preact_min["h"])(
					'div',
					{ 'class': 'column is-half is-offset-one-quarter' },
					Object(preact_min["h"])(
						'div',
						{ 'class': 'box' },
						Login__ref,
						Object(preact_min["h"])(
							'a',
							{ href: '/auth/github', native: true,
								'class': 'button is-large is-dark is-flex ' + isLoading,
								onClick: this.toogleLogginIn },
							Login__ref2,
							Login__ref3
						)
					)
				)
			)
		);
	};

	return Login;
}(preact_min["Component"]);


// EXTERNAL MODULE: ./components/app/notification/style.scss
var notification_style = __webpack_require__("zJyk");
var notification_style_default = /*#__PURE__*/__webpack_require__.n(notification_style);

// CONCATENATED MODULE: ./components/app/Notification.js


function Notification__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Notification__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function Notification__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var Notification_Notification = function (_Component) {
  Notification__inherits(Notification, _Component);

  function Notification(props) {
    Notification__classCallCheck(this, Notification);

    var _this = Notification__possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = { type: '', text: '', visible: false };
    _this.hide = _this.hide.bind(_this);
    _this.onError = _this.onError.bind(_this);
    _this.onInfo = _this.onInfo.bind(_this);
    return _this;
  }

  Notification.prototype.componentDidMount = function componentDidMount() {
    event_emitter.on('DISPLAY_ERROR', this.onError);
    event_emitter.on('DISPLAY_INFO', this.onInfo);
  };

  Notification.prototype.componentWillUnmount = function componentWillUnmount() {
    event_emitter.off('DISPLAY_ERROR', this.onError);
    event_emitter.off('DISPLAY_INFO', this.onInfo);
  };

  Notification.prototype.onError = function onError(msg) {
    var _this2 = this;

    this.show('is-danger', msg);
    setTimeout(function () {
      return _this2.hide();
    }, this.props.duration || 2000);
  };

  Notification.prototype.onInfo = function onInfo(msg) {
    var _this3 = this;

    this.show('is-info', msg);
    setTimeout(function () {
      return _this3.hide();
    }, this.props.duration || 2000);
  };

  Notification.prototype.show = function show(type, text) {
    this.setState({ type: type, text: text, visible: true });
  };

  Notification.prototype.hide = function hide() {
    if (this.state.visible) {
      this.setState({ type: '', text: '', visible: false });
    }
  };

  Notification.prototype.render = function render(props, state) {
    if (!state.visible) return null;
    return Object(preact_min["h"])(
      'div',
      { 'class': notification_style_default.a['notification-container'] },
      Object(preact_min["h"])(
        'div',
        { 'class': 'notification ' + state.type },
        Object(preact_min["h"])('button', { 'class': 'delete', onClick: this.hide }),
        Object(preact_min["h"])(
          'p',
          null,
          state.text
        )
      )
    );
  };

  return Notification;
}(preact_min["Component"]);


// CONCATENATED MODULE: ./components/app/Message.js


function Message__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Message__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function Message__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var Message__ref = Object(preact_min["h"])('div', { 'class': 'modal-background' });

var Message_Message = function (_Component) {
  Message__inherits(Message, _Component);

  function Message(props) {
    Message__classCallCheck(this, Message);

    var _this = Message__possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = { msg: '', visible: false };
    _this.hide = _this.hide.bind(_this);
    _this.show = _this.show.bind(_this);
    return _this;
  }

  Message.prototype.componentDidMount = function componentDidMount() {
    event_emitter.on('DISPLAY_MESSAGE', this.show);
  };

  Message.prototype.componentWillUnmount = function componentWillUnmount() {
    event_emitter.off('DISPLAY_MESSAGE', this.show);
  };

  Message.prototype.show = function show(msg) {
    this.setState({ msg: msg, visible: true });
  };

  Message.prototype.hide = function hide() {
    if (this.state.visible) {
      this.setState({ msg: '', visible: false });
    }
  };

  Message.prototype.render = function render(props, state) {
    if (!state.visible) return null;
    return Object(preact_min["h"])(
      'div',
      { 'class': 'modal is-active' },
      Message__ref,
      Object(preact_min["h"])(
        'div',
        { 'class': 'modal-content' },
        Object(preact_min["h"])(
          'div',
          { 'class': 'notification' },
          state.msg
        )
      ),
      Object(preact_min["h"])('button', { 'class': 'modal-close is-large', 'aria-label': 'close',
        onClick: this.hide })
    );
  };

  return Message;
}(preact_min["Component"]);


// CONCATENATED MODULE: ./components/App.js


function App__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function App__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function App__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }












// import Home from 'async!./home/home';


if (false) {
	require('preact/debug');
}

var prerendering = typeof window === 'undefined';

var App__ref2 = Object(preact_min["h"])(Home_Home, null);

var App__ref3 = Object(preact_min["h"])(Login_Login, { path: '/login' });

var App__ref4 = Object(preact_min["h"])(Message_Message, null);

var _ref5 = Object(preact_min["h"])(Notification_Notification, { duration: '4000' });

var App_App = function (_Component) {
	App__inherits(App, _Component);

	function App(props) {
		App__classCallCheck(this, App);

		var _this = App__possibleConstructorReturn(this, _Component.call(this, props));

		_this.handleRoute = function (event) {
			// Check if not Pre-rendering
			if (!prerendering && event.url === '/') {
				var loggedIn = auth_default.a.isLoggedIn();
				if (loggedIn) {
					if (!_this.state.loggedIn) _this.setState({ loggedIn: true });
				} else {
					var accessToken = auth_default.a.extractAccessToken(window.location.hash);
					if (accessToken) {
						auth_default.a.logIn(accessToken);
						_this.setState({ loggedIn: true });
						Object(preact_router_es["route"])('/', true);
					} else {
						Object(preact_router_es["route"])('/login', true);
					}
				}
			}
		};

		_this.state = { loggedIn: false };
		_this.handleRoute = _this.handleRoute.bind(_this);
		_this.logOut = _this.logOut.bind(_this);
		return _this;
	}

	App.prototype.componentDidMount = function componentDidMount() {
		event_emitter.on('UNAUTHORIZED', this.logOut);
	};

	App.prototype.componentWillUnmount = function componentWillUnmount() {
		event_emitter.off('UNAUTHORIZED', this.logOut);
	};

	/** Gets fired when the route changes.
  *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
  *	@param {string} event.url	The newly routed URL
  */


	App.prototype.logOut = function logOut() {
		auth_default.a.logOut();
		this.setState({ loggedIn: false });
		Object(preact_router_es["route"])('/login', true);
	};

	App.prototype.render = function render(props, state) {
		return Object(preact_min["h"])(
			'div',
			{ id: 'app' },
			Object(preact_min["h"])(Header_Header, { loggedIn: state.loggedIn, logOut: this.logOut }),
			Object(preact_min["h"])(
				preact_router_es["Router"],
				{ onChange: this.handleRoute },
				Object(preact_min["h"])(
					match_default.a,
					{ path: '/' },
					function (_ref) {
						var matches = _ref.matches;
						return matches && state.loggedIn && App__ref2;
					}
				),
				App__ref3
			),
			App__ref4,
			_ref5
		);
	};

	return App;
}(preact_min["Component"]);


// CONCATENATED MODULE: ./index.js



/* harmony default export */ var index_0 = __webpack_exports__["default"] = (App_App);

/***/ }),

/***/ "KEvG":
/***/ (function(module, exports) {

module.exports = { prefix: 'fas', iconName: 'location-arrow', icon: [512, 512, [], "f124", "M443.683 4.529L27.818 196.418C-18.702 217.889-3.39 288 47.933 288H224v175.993c0 51.727 70.161 66.526 91.582 20.115L507.38 68.225c18.905-40.961-23.752-82.133-63.697-63.696z"] };

/***/ }),

/***/ "KM04":
/***/ (function(module, exports, __webpack_require__) {

!function () {
  "use strict";
  function e() {}function t(t, n) {
    var o,
        r,
        i,
        l,
        a = E;for (l = arguments.length; l-- > 2;) {
      W.push(arguments[l]);
    }n && null != n.children && (W.length || W.push(n.children), delete n.children);while (W.length) {
      if ((r = W.pop()) && void 0 !== r.pop) for (l = r.length; l--;) {
        W.push(r[l]);
      } else "boolean" == typeof r && (r = null), (i = "function" != typeof t) && (null == r ? r = "" : "number" == typeof r ? r += "" : "string" != typeof r && (i = !1)), i && o ? a[a.length - 1] += r : a === E ? a = [r] : a.push(r), o = i;
    }var u = new e();return u.nodeName = t, u.children = a, u.attributes = null == n ? void 0 : n, u.key = null == n ? void 0 : n.key, void 0 !== S.vnode && S.vnode(u), u;
  }function n(e, t) {
    for (var n in t) {
      e[n] = t[n];
    }return e;
  }function o(e, o) {
    return t(e.nodeName, n(n({}, e.attributes), o), arguments.length > 2 ? [].slice.call(arguments, 2) : e.children);
  }function r(e) {
    !e.__d && (e.__d = !0) && 1 == A.push(e) && (S.debounceRendering || P)(i);
  }function i() {
    var e,
        t = A;A = [];while (e = t.pop()) {
      e.__d && k(e);
    }
  }function l(e, t, n) {
    return "string" == typeof t || "number" == typeof t ? void 0 !== e.splitText : "string" == typeof t.nodeName ? !e._componentConstructor && a(e, t.nodeName) : n || e._componentConstructor === t.nodeName;
  }function a(e, t) {
    return e.__n === t || e.nodeName.toLowerCase() === t.toLowerCase();
  }function u(e) {
    var t = n({}, e.attributes);t.children = e.children;var o = e.nodeName.defaultProps;if (void 0 !== o) for (var r in o) {
      void 0 === t[r] && (t[r] = o[r]);
    }return t;
  }function _(e, t) {
    var n = t ? document.createElementNS("http://www.w3.org/2000/svg", e) : document.createElement(e);return n.__n = e, n;
  }function p(e) {
    var t = e.parentNode;t && t.removeChild(e);
  }function c(e, t, n, o, r) {
    if ("className" === t && (t = "class"), "key" === t) ;else if ("ref" === t) n && n(null), o && o(e);else if ("class" !== t || r) {
      if ("style" === t) {
        if (o && "string" != typeof o && "string" != typeof n || (e.style.cssText = o || ""), o && "object" == typeof o) {
          if ("string" != typeof n) for (var i in n) {
            i in o || (e.style[i] = "");
          }for (var i in o) {
            e.style[i] = "number" == typeof o[i] && !1 === V.test(i) ? o[i] + "px" : o[i];
          }
        }
      } else if ("dangerouslySetInnerHTML" === t) o && (e.innerHTML = o.__html || "");else if ("o" == t[0] && "n" == t[1]) {
        var l = t !== (t = t.replace(/Capture$/, ""));t = t.toLowerCase().substring(2), o ? n || e.addEventListener(t, f, l) : e.removeEventListener(t, f, l), (e.__l || (e.__l = {}))[t] = o;
      } else if ("list" !== t && "type" !== t && !r && t in e) s(e, t, null == o ? "" : o), null != o && !1 !== o || e.removeAttribute(t);else {
        var a = r && t !== (t = t.replace(/^xlink\:?/, ""));null == o || !1 === o ? a ? e.removeAttributeNS("http://www.w3.org/1999/xlink", t.toLowerCase()) : e.removeAttribute(t) : "function" != typeof o && (a ? e.setAttributeNS("http://www.w3.org/1999/xlink", t.toLowerCase(), o) : e.setAttribute(t, o));
      }
    } else e.className = o || "";
  }function s(e, t, n) {
    try {
      e[t] = n;
    } catch (e) {}
  }function f(e) {
    return this.__l[e.type](S.event && S.event(e) || e);
  }function d() {
    var e;while (e = D.pop()) {
      S.afterMount && S.afterMount(e), e.componentDidMount && e.componentDidMount();
    }
  }function h(e, t, n, o, r, i) {
    H++ || (R = null != r && void 0 !== r.ownerSVGElement, j = null != e && !("__preactattr_" in e));var l = m(e, t, n, o, i);return r && l.parentNode !== r && r.appendChild(l), --H || (j = !1, i || d()), l;
  }function m(e, t, n, o, r) {
    var i = e,
        l = R;if (null != t && "boolean" != typeof t || (t = ""), "string" == typeof t || "number" == typeof t) return e && void 0 !== e.splitText && e.parentNode && (!e._component || r) ? e.nodeValue != t && (e.nodeValue = t) : (i = document.createTextNode(t), e && (e.parentNode && e.parentNode.replaceChild(i, e), b(e, !0))), i.__preactattr_ = !0, i;var u = t.nodeName;if ("function" == typeof u) return U(e, t, n, o);if (R = "svg" === u || "foreignObject" !== u && R, u += "", (!e || !a(e, u)) && (i = _(u, R), e)) {
      while (e.firstChild) {
        i.appendChild(e.firstChild);
      }e.parentNode && e.parentNode.replaceChild(i, e), b(e, !0);
    }var p = i.firstChild,
        c = i.__preactattr_,
        s = t.children;if (null == c) {
      c = i.__preactattr_ = {};for (var f = i.attributes, d = f.length; d--;) {
        c[f[d].name] = f[d].value;
      }
    }return !j && s && 1 === s.length && "string" == typeof s[0] && null != p && void 0 !== p.splitText && null == p.nextSibling ? p.nodeValue != s[0] && (p.nodeValue = s[0]) : (s && s.length || null != p) && v(i, s, n, o, j || null != c.dangerouslySetInnerHTML), g(i, t.attributes, c), R = l, i;
  }function v(e, t, n, o, r) {
    var i,
        a,
        u,
        _,
        c,
        s = e.childNodes,
        f = [],
        d = {},
        h = 0,
        v = 0,
        y = s.length,
        g = 0,
        w = t ? t.length : 0;if (0 !== y) for (var C = 0; C < y; C++) {
      var x = s[C],
          N = x.__preactattr_,
          k = w && N ? x._component ? x._component.__k : N.key : null;null != k ? (h++, d[k] = x) : (N || (void 0 !== x.splitText ? !r || x.nodeValue.trim() : r)) && (f[g++] = x);
    }if (0 !== w) for (var C = 0; C < w; C++) {
      _ = t[C], c = null;var k = _.key;if (null != k) h && void 0 !== d[k] && (c = d[k], d[k] = void 0, h--);else if (!c && v < g) for (i = v; i < g; i++) {
        if (void 0 !== f[i] && l(a = f[i], _, r)) {
          c = a, f[i] = void 0, i === g - 1 && g--, i === v && v++;break;
        }
      }c = m(c, _, n, o), u = s[C], c && c !== e && c !== u && (null == u ? e.appendChild(c) : c === u.nextSibling ? p(u) : e.insertBefore(c, u));
    }if (h) for (var C in d) {
      void 0 !== d[C] && b(d[C], !1);
    }while (v <= g) {
      void 0 !== (c = f[g--]) && b(c, !1);
    }
  }function b(e, t) {
    var n = e._component;n ? L(n) : (null != e.__preactattr_ && e.__preactattr_.ref && e.__preactattr_.ref(null), !1 !== t && null != e.__preactattr_ || p(e), y(e));
  }function y(e) {
    e = e.lastChild;while (e) {
      var t = e.previousSibling;b(e, !0), e = t;
    }
  }function g(e, t, n) {
    var o;for (o in n) {
      t && null != t[o] || null == n[o] || c(e, o, n[o], n[o] = void 0, R);
    }for (o in t) {
      "children" === o || "innerHTML" === o || o in n && t[o] === ("value" === o || "checked" === o ? e[o] : n[o]) || c(e, o, n[o], n[o] = t[o], R);
    }
  }function w(e) {
    var t = e.constructor.name;(I[t] || (I[t] = [])).push(e);
  }function C(e, t, n) {
    var o,
        r = I[e.name];if (e.prototype && e.prototype.render ? (o = new e(t, n), T.call(o, t, n)) : (o = new T(t, n), o.constructor = e, o.render = x), r) for (var i = r.length; i--;) {
      if (r[i].constructor === e) {
        o.__b = r[i].__b, r.splice(i, 1);break;
      }
    }return o;
  }function x(e, t, n) {
    return this.constructor(e, n);
  }function N(e, t, n, o, i) {
    e.__x || (e.__x = !0, (e.__r = t.ref) && delete t.ref, (e.__k = t.key) && delete t.key, !e.base || i ? e.componentWillMount && e.componentWillMount() : e.componentWillReceiveProps && e.componentWillReceiveProps(t, o), o && o !== e.context && (e.__c || (e.__c = e.context), e.context = o), e.__p || (e.__p = e.props), e.props = t, e.__x = !1, 0 !== n && (1 !== n && !1 === S.syncComponentUpdates && e.base ? r(e) : k(e, 1, i)), e.__r && e.__r(e));
  }function k(e, t, o, r) {
    if (!e.__x) {
      var i,
          l,
          a,
          _ = e.props,
          p = e.state,
          c = e.context,
          s = e.__p || _,
          f = e.__s || p,
          m = e.__c || c,
          v = e.base,
          y = e.__b,
          g = v || y,
          w = e._component,
          x = !1;if (v && (e.props = s, e.state = f, e.context = m, 2 !== t && e.shouldComponentUpdate && !1 === e.shouldComponentUpdate(_, p, c) ? x = !0 : e.componentWillUpdate && e.componentWillUpdate(_, p, c), e.props = _, e.state = p, e.context = c), e.__p = e.__s = e.__c = e.__b = null, e.__d = !1, !x) {
        i = e.render(_, p, c), e.getChildContext && (c = n(n({}, c), e.getChildContext()));var U,
            T,
            M = i && i.nodeName;if ("function" == typeof M) {
          var W = u(i);l = w, l && l.constructor === M && W.key == l.__k ? N(l, W, 1, c, !1) : (U = l, e._component = l = C(M, W, c), l.__b = l.__b || y, l.__u = e, N(l, W, 0, c, !1), k(l, 1, o, !0)), T = l.base;
        } else a = g, U = w, U && (a = e._component = null), (g || 1 === t) && (a && (a._component = null), T = h(a, i, c, o || !v, g && g.parentNode, !0));if (g && T !== g && l !== w) {
          var E = g.parentNode;E && T !== E && (E.replaceChild(T, g), U || (g._component = null, b(g, !1)));
        }if (U && L(U), e.base = T, T && !r) {
          var P = e,
              V = e;while (V = V.__u) {
            (P = V).base = T;
          }T._component = P, T._componentConstructor = P.constructor;
        }
      }if (!v || o ? D.unshift(e) : x || (e.componentDidUpdate && e.componentDidUpdate(s, f, m), S.afterUpdate && S.afterUpdate(e)), null != e.__h) while (e.__h.length) {
        e.__h.pop().call(e);
      }H || r || d();
    }
  }function U(e, t, n, o) {
    var r = e && e._component,
        i = r,
        l = e,
        a = r && e._componentConstructor === t.nodeName,
        _ = a,
        p = u(t);while (r && !_ && (r = r.__u)) {
      _ = r.constructor === t.nodeName;
    }return r && _ && (!o || r._component) ? (N(r, p, 3, n, o), e = r.base) : (i && !a && (L(i), e = l = null), r = C(t.nodeName, p, n), e && !r.__b && (r.__b = e, l = null), N(r, p, 1, n, o), e = r.base, l && e !== l && (l._component = null, b(l, !1))), e;
  }function L(e) {
    S.beforeUnmount && S.beforeUnmount(e);var t = e.base;e.__x = !0, e.componentWillUnmount && e.componentWillUnmount(), e.base = null;var n = e._component;n ? L(n) : t && (t.__preactattr_ && t.__preactattr_.ref && t.__preactattr_.ref(null), e.__b = t, p(t), w(e), y(t)), e.__r && e.__r(null);
  }function T(e, t) {
    this.__d = !0, this.context = t, this.props = e, this.state = this.state || {};
  }function M(e, t, n) {
    return h(n, e, {}, !1, t, !1);
  }var S = {},
      W = [],
      E = [],
      P = "function" == typeof Promise ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout,
      V = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i,
      A = [],
      D = [],
      H = 0,
      R = !1,
      j = !1,
      I = {};n(T.prototype, { setState: function setState(e, t) {
      var o = this.state;this.__s || (this.__s = n({}, o)), n(o, "function" == typeof e ? e(o, this.props) : e), t && (this.__h = this.__h || []).push(t), r(this);
    }, forceUpdate: function forceUpdate(e) {
      e && (this.__h = this.__h || []).push(e), k(this, 2);
    }, render: function render() {} });var $ = { h: t, createElement: t, cloneElement: o, Component: T, render: M, rerender: i, options: S }; true ? module.exports = $ : self.preact = $;
}();
//# sourceMappingURL=preact.min.js.map

/***/ }),

/***/ "KRuG":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("S1cf");
var settle = __webpack_require__("aS8y");
var buildURL = __webpack_require__("H6Qo");
var parseHeaders = __webpack_require__("ZeD7");
var isURLSameOrigin = __webpack_require__("/w7L");
var createError = __webpack_require__("3bIi");
var btoa = typeof window !== 'undefined' && window.btoa && window.btoa.bind(window) || __webpack_require__("mmkS");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ("production" !== 'test' && typeof window !== 'undefined' && window.XDomainRequest && !('withCredentials' in request) && !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || request.readyState !== 4 && !xDomain) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__("dn2M");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

/***/ }),

/***/ "M8l6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("S1cf");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

/***/ }),

/***/ "OKRy":
/***/ (function(module, exports) {

module.exports = { prefix: 'fas', iconName: 'link', icon: [512, 512, [], "f0c1", "M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"] };

/***/ }),

/***/ "OvAf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__("BXyq");
var utils = __webpack_require__("S1cf");
var InterceptorManager = __webpack_require__("rj2i");
var dispatchRequest = __webpack_require__("uz6X");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, { method: 'get' }, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function (url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function (url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

/***/ }),

/***/ "PEzW":
/***/ (function(module, exports) {

var extractAccessToken = function extractAccessToken(locationHash) {
	var match = RegExp(/[#&]access_token=([^&]*)/).exec(locationHash);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

var getAccessToken = function getAccessToken() {
	return localStorage.getItem('access_token');
};

var isLoggedIn = function isLoggedIn() {
	return !!localStorage.getItem('access_token');
};

var logIn = function logIn(accessToken) {
	localStorage.setItem('access_token', accessToken);
};

var logOut = function logOut() {
	return localStorage.removeItem('access_token');
};

module.exports = {
	extractAccessToken: extractAccessToken,
	getAccessToken: getAccessToken,
	isLoggedIn: isLoggedIn,
	logIn: logIn,
	logOut: logOut
};

/***/ }),

/***/ "S1cf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__("ED/T");
var isBuffer = __webpack_require__("q/Zl");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return typeof FormData !== 'undefined' && val instanceof FormData;
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && val.buffer instanceof ArrayBuffer;
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge() /* obj1, obj2, obj3, ... */{
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};

/***/ }),

/***/ "UQex":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),

/***/ "V3+0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

/***/ }),

/***/ "Vy1O":
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "X8jb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */

module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

/***/ }),

/***/ "XNXn":
/***/ (function(module, exports) {

module.exports = { prefix: 'fas', iconName: 'trash-alt', icon: [448, 512, [], "f2ed", "M0 84V56c0-13.3 10.7-24 24-24h112l9.4-18.7c4-8.2 12.3-13.3 21.4-13.3h114.3c9.1 0 17.4 5.1 21.5 13.3L312 32h112c13.3 0 24 10.7 24 24v28c0 6.6-5.4 12-12 12H12C5.4 96 0 90.6 0 84zm416 56v324c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V140c0-6.6 5.4-12 12-12h360c6.6 0 12 5.4 12 12zm-272 68c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208z"] };

/***/ }),

/***/ "XgVs":
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "YHt5":
/***/ (function(module, exports) {

module.exports = { prefix: 'fas', iconName: 'music', icon: [512, 512, [], "f001", "M470.4 1.5l-304 96C153.1 101.7 144 114 144 128v264.6c-14.1-5.4-30.5-8.6-48-8.6-53 0-96 28.7-96 64s43 64 96 64 96-28.7 96-64V220.5l272-85.9v194c-14.1-5.4-30.5-8.6-48-8.6-53 0-96 28.7-96 64s43 64 96 64 96-28.7 96-64V32c0-21.7-21.1-37-41.6-30.5z"] };

/***/ }),

/***/ "YdsM":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */

module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};

/***/ }),

/***/ "ZeD7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("S1cf");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = ['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent'];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) {
    return parsed;
  }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

/***/ }),

/***/ "a2Uu":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */

module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
};

/***/ }),

/***/ "aS8y":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__("3bIi");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError('Request failed with status code ' + response.status, response.config, null, response.request, response));
  }
};

/***/ }),

/***/ "bRJm":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("S1cf");
var settle = __webpack_require__("aS8y");
var buildURL = __webpack_require__("H6Qo");
var http = __webpack_require__("gHkb");
var https = __webpack_require__("XgVs");
var httpFollow = __webpack_require__("3JCP").http;
var httpsFollow = __webpack_require__("3JCP").https;
var url = __webpack_require__("Vy1O");
var zlib = __webpack_require__("epkN");
var pkg = __webpack_require__("kHha");
var createError = __webpack_require__("3bIi");
var enhanceError = __webpack_require__("YdsM");

/*eslint consistent-return:0*/
module.exports = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolve, reject) {
    var data = config.data;
    var headers = config.headers;
    var timer;

    // Set User-Agent (required by some servers)
    // Only set header if it hasn't been set in config
    // See https://github.com/axios/axios/issues/69
    if (!headers['User-Agent'] && !headers['user-agent']) {
      headers['User-Agent'] = 'axios/' + pkg.version;
    }

    if (data && !utils.isStream(data)) {
      if (Buffer.isBuffer(data)) {
        // Nothing to do...
      } else if (utils.isArrayBuffer(data)) {
        data = new Buffer(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = new Buffer(data, 'utf-8');
      } else {
        return reject(createError('Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream', config));
      }

      // Add Content-Length header if data exists
      headers['Content-Length'] = data.length;
    }

    // HTTP basic authentication
    var auth = undefined;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    }

    // Parse url
    var parsed = url.parse(config.url);
    var protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth) {
      delete headers.Authorization;
    }

    var isHttps = protocol === 'https:';
    var agent = isHttps ? config.httpsAgent : config.httpAgent;

    var options = {
      path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method,
      headers: headers,
      agent: agent,
      auth: auth
    };

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
    }

    var proxy = config.proxy;
    if (!proxy && proxy !== false) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        proxy = {
          host: parsedProxyUrl.hostname,
          port: parsedProxyUrl.port
        };

        if (parsedProxyUrl.auth) {
          var proxyUrlAuth = parsedProxyUrl.auth.split(':');
          proxy.auth = {
            username: proxyUrlAuth[0],
            password: proxyUrlAuth[1]
          };
        }
      }
    }

    if (proxy) {
      options.hostname = proxy.host;
      options.host = proxy.host;
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      options.port = proxy.port;
      options.path = protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path;

      // Basic proxy authorization
      if (proxy.auth) {
        var base64 = new Buffer(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
        options.headers['Proxy-Authorization'] = 'Basic ' + base64;
      }
    }

    var transport;
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttps ? https : http;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      transport = isHttps ? httpsFollow : httpFollow;
    }

    if (config.maxContentLength && config.maxContentLength > -1) {
      options.maxBodyLength = config.maxContentLength;
    }

    // Create the request
    var req = transport.request(options, function handleResponse(res) {
      if (req.aborted) return;

      // Response has been received so kill timer that handles request timeout
      clearTimeout(timer);
      timer = null;

      // uncompress the response body transparently if required
      var stream = res;
      switch (res.headers['content-encoding']) {
        /*eslint default-case:0*/
        case 'gzip':
        case 'compress':
        case 'deflate':
          // add the unzipper to the body stream processing pipeline
          stream = stream.pipe(zlib.createUnzip());

          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
          break;
      }

      // return the last request in case of redirects
      var lastRequest = res.req || req;

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      if (config.responseType === 'stream') {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        var responseBuffer = [];
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded', config, null, lastRequest));
          }
        });

        stream.on('error', function handleStreamError(err) {
          if (req.aborted) return;
          reject(enhanceError(err, config, null, lastRequest));
        });

        stream.on('end', function handleStreamEnd() {
          var responseData = Buffer.concat(responseBuffer);
          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString('utf8');
          }

          response.data = responseData;
          settle(resolve, reject, response);
        });
      }
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      if (req.aborted) return;
      reject(enhanceError(err, config, null, req));
    });

    // Handle request timeout
    if (config.timeout && !timer) {
      timer = setTimeout(function handleRequestTimeout() {
        req.abort();
        reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', req));
      }, config.timeout);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (req.aborted) return;

        req.abort();
        reject(cancel);
      });
    }

    // Send the request
    if (utils.isStream(data)) {
      data.pipe(req);
    } else {
      req.end(data);
    }
  });
};

/***/ }),

/***/ "dZBD":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("nUiQ");

/***/ }),

/***/ "dn2M":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("S1cf");

module.exports = utils.isStandardBrowserEnv() ?

// Standard browser envs support document.cookie
function standardBrowserEnv() {
  return {
    write: function write(name, value, expires, path, domain, secure) {
      var cookie = [];
      cookie.push(name + '=' + encodeURIComponent(value));

      if (utils.isNumber(expires)) {
        cookie.push('expires=' + new Date(expires).toGMTString());
      }

      if (utils.isString(path)) {
        cookie.push('path=' + path);
      }

      if (utils.isString(domain)) {
        cookie.push('domain=' + domain);
      }

      if (secure === true) {
        cookie.push('secure');
      }

      document.cookie = cookie.join('; ');
    },

    read: function read(name) {
      var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return match ? decodeURIComponent(match[3]) : null;
    },

    remove: function remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  };
}() :

// Non standard browser env (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
  return {
    write: function write() {},
    read: function read() {
      return null;
    },
    remove: function remove() {}
  };
}();

/***/ }),

/***/ "epkN":
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ }),

/***/ "gHkb":
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "jcLW":
/***/ (function(module, exports, __webpack_require__) {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__("y5CM");
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();

/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
  // is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
  // is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
  // double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch (e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch (e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

/***/ }),

/***/ "kHha":
/***/ (function(module, exports) {

module.exports = {"_from":"axios","_id":"axios@0.18.0","_inBundle":false,"_integrity":"sha1-MtU+SFHv3AoRmTts0AB4nXDAUQI=","_location":"/axios","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"axios","name":"axios","escapedName":"axios","rawSpec":"","saveSpec":null,"fetchSpec":"latest"},"_requiredBy":["#USER","/"],"_resolved":"https://registry.npmjs.org/axios/-/axios-0.18.0.tgz","_shasum":"32d53e4851efdc0a11993b6cd000789d70c05102","_spec":"axios","_where":"/home/felipewer/projects/startup_buzzer/frontend","author":{"name":"Matt Zabriskie"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"bugs":{"url":"https://github.com/axios/axios/issues"},"bundleDependencies":false,"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}],"dependencies":{"follow-redirects":"^1.3.0","is-buffer":"^1.1.5"},"deprecated":false,"description":"Promise based HTTP client for the browser and node.js","devDependencies":{"bundlesize":"^0.5.7","coveralls":"^2.11.9","es6-promise":"^4.0.5","grunt":"^1.0.1","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.0.0","grunt-contrib-nodeunit":"^1.0.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^19.0.0","grunt-karma":"^2.0.0","grunt-ts":"^6.0.0-beta.3","grunt-webpack":"^1.0.18","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^1.3.0","karma-chrome-launcher":"^2.0.0","karma-coverage":"^1.0.0","karma-firefox-launcher":"^1.0.0","karma-jasmine":"^1.0.2","karma-jasmine-ajax":"^0.1.13","karma-opera-launcher":"^1.0.0","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^1.1.0","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.7","karma-webpack":"^1.7.0","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","sinon":"^1.17.4","typescript":"^2.0.3","url-search-params":"^0.6.1","webpack":"^1.13.1","webpack-dev-server":"^1.14.1"},"homepage":"https://github.com/axios/axios","keywords":["xhr","http","ajax","promise","node"],"license":"MIT","main":"index.js","name":"axios","repository":{"type":"git","url":"git+https://github.com/axios/axios.git"},"scripts":{"build":"NODE_ENV=production grunt build","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","examples":"node ./examples/server.js","postversion":"git push && git push --tags","preversion":"npm test","start":"node ./sandbox/server.js","test":"grunt test && bundlesize","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"},"typings":"./index.d.ts","version":"0.18.0"}

/***/ }),

/***/ "mI+K":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */

function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

/***/ }),

/***/ "mmkS":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error();
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
  // initialize result and counter
  var block, charCode, idx = 0, map = chars;
  // if the next str index does not exist:
  //   change the mapping table to "="
  //   check if d has no fractional digits
  str.charAt(idx | 0) || (map = '=', idx % 1);
  // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
  output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;

/***/ }),

/***/ "nUiQ":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("S1cf");
var bind = __webpack_require__("ED/T");
var Axios = __webpack_require__("OvAf");
var defaults = __webpack_require__("BXyq");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__("mI+K");
axios.CancelToken = __webpack_require__("tsWd");
axios.isCancel = __webpack_require__("V3+0");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__("X8jb");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

/***/ }),

/***/ "q/Zl":
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
};

function isBuffer(obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer(obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0));
}

/***/ }),

/***/ "rj2i":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("S1cf");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

/***/ }),

/***/ "sw5u":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Link = exports.Match = undefined;

var _extends = Object.assign || function (target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = arguments[i];for (var key in source) {
			if (Object.prototype.hasOwnProperty.call(source, key)) {
				target[key] = source[key];
			}
		}
	}return target;
};

var _preact = __webpack_require__("KM04");

var _preactRouter = __webpack_require__("/QC5");

function _objectWithoutProperties(obj, keys) {
	var target = {};for (var i in obj) {
		if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
	}return target;
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Match = exports.Match = function (_Component) {
	_inherits(Match, _Component);

	function Match() {
		var _temp, _this, _ret;

		_classCallCheck(this, Match);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.update = function (url) {
			_this.nextUrl = url;
			_this.setState({});
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	Match.prototype.componentDidMount = function componentDidMount() {
		_preactRouter.subscribers.push(this.update);
	};

	Match.prototype.componentWillUnmount = function componentWillUnmount() {
		_preactRouter.subscribers.splice(_preactRouter.subscribers.indexOf(this.update) >>> 0, 1);
	};

	Match.prototype.render = function render(props) {
		var url = this.nextUrl || (0, _preactRouter.getCurrentUrl)(),
		    path = url.replace(/\?.+$/, '');
		this.nextUrl = null;
		return props.children[0] && props.children[0]({
			url: url,
			path: path,
			matches: path === props.path
		});
	};

	return Match;
}(_preact.Component);

var Link = function Link(_ref) {
	var activeClassName = _ref.activeClassName,
	    path = _ref.path,
	    props = _objectWithoutProperties(_ref, ['activeClassName', 'path']);

	return (0, _preact.h)(Match, { path: path || props.href }, function (_ref2) {
		var matches = _ref2.matches;
		return (0, _preact.h)(_preactRouter.Link, _extends({}, props, { 'class': [props.class || props.className, matches && activeClassName].filter(Boolean).join(' ') }));
	});
};

exports.Link = Link;
exports.default = Match;

Match.Link = Link;

/***/ }),

/***/ "tsWd":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__("mI+K");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

/***/ }),

/***/ "uz6X":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("S1cf");
var transformData = __webpack_require__("woEt");
var isCancel = __webpack_require__("V3+0");
var defaults = __webpack_require__("BXyq");
var isAbsoluteURL = __webpack_require__("7/2Y");
var combineURLs = __webpack_require__("a2Uu");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(config.data, config.headers, config.transformRequest);

  // Flatten headers
  config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers || {});

  utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
    delete config.headers[method];
  });

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(response.data, response.headers, config.transformResponse);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(reason.response.data, reason.response.headers, config.transformResponse);
      }
    }

    return Promise.reject(reason);
  });
};

/***/ }),

/***/ "vie6":
/***/ (function(module, exports) {

module.exports = { prefix: 'fas', iconName: 'play', icon: [448, 512, [], "f04b", "M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"] };

/***/ }),

/***/ "wRU+":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (false) {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;

/***/ }),

/***/ "wVGV":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__("UQex");
var invariant = __webpack_require__("wRU+");
var ReactPropTypesSecret = __webpack_require__("Asjh");

module.exports = function () {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(false, 'Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use PropTypes.checkPropTypes() to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/***/ }),

/***/ "woEt":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("S1cf");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

/***/ }),

/***/ "y5CM":
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__("6IAg");

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0,
      i;

  for (i in namespace) {
    hash = (hash << 5) - hash + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy() {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

/***/ }),

/***/ "yY49":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "zJyk":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"notification-container":"notification-container__emcEP"};

/***/ })

/******/ });
//# sourceMappingURL=ssr-bundle.js.map