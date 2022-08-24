"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // node_modules/local-storage/stub.js
  var require_stub = __commonJS({
    "node_modules/local-storage/stub.js"(exports, module) {
      "use strict";
      var ms = {};
      function getItem(key) {
        return key in ms ? ms[key] : null;
      }
      function setItem(key, value) {
        ms[key] = value;
        return true;
      }
      function removeItem(key) {
        var found = key in ms;
        if (found) {
          return delete ms[key];
        }
        return false;
      }
      function clear() {
        ms = {};
        return true;
      }
      module.exports = {
        getItem,
        setItem,
        removeItem,
        clear
      };
    }
  });

  // node_modules/local-storage/parse.js
  var require_parse = __commonJS({
    "node_modules/local-storage/parse.js"(exports, module) {
      "use strict";
      function parse(rawValue) {
        const parsed = parseValue(rawValue);
        if (parsed === void 0) {
          return null;
        }
        return parsed;
      }
      function parseValue(rawValue) {
        try {
          return JSON.parse(rawValue);
        } catch (err) {
          return rawValue;
        }
      }
      module.exports = parse;
    }
  });

  // node_modules/local-storage/tracking.js
  var require_tracking = __commonJS({
    "node_modules/local-storage/tracking.js"(exports, module) {
      "use strict";
      var parse = require_parse();
      var listeners = {};
      var listening = false;
      function listen() {
        if (window.addEventListener) {
          window.addEventListener("storage", change, false);
        } else if (window.attachEvent) {
          window.attachEvent("onstorage", change);
        } else {
          window.onstorage = change;
        }
      }
      function change(e) {
        if (!e) {
          e = window.event;
        }
        var all = listeners[e.key];
        if (all) {
          all.forEach(fire);
        }
        function fire(listener) {
          listener(parse(e.newValue), parse(e.oldValue), e.url || e.uri);
        }
      }
      function on(key, fn) {
        if (listeners[key]) {
          listeners[key].push(fn);
        } else {
          listeners[key] = [fn];
        }
        if (listening === false) {
          listen();
        }
      }
      function off(key, fn) {
        var ns = listeners[key];
        if (ns.length > 1) {
          ns.splice(ns.indexOf(fn), 1);
        } else {
          listeners[key] = [];
        }
      }
      module.exports = {
        on,
        off
      };
    }
  });

  // node_modules/local-storage/local-storage.js
  var require_local_storage = __commonJS({
    "node_modules/local-storage/local-storage.js"(exports, module) {
      "use strict";
      var stub = require_stub();
      var parse = require_parse();
      var tracking = require_tracking();
      var ls = "localStorage" in window && window.localStorage ? window.localStorage : stub;
      function accessor(key, value) {
        if (arguments.length === 1) {
          return get2(key);
        }
        return set2(key, value);
      }
      function get2(key) {
        const raw = ls.getItem(key);
        const parsed = parse(raw);
        return parsed;
      }
      function set2(key, value) {
        try {
          ls.setItem(key, JSON.stringify(value));
          return true;
        } catch (e) {
          return false;
        }
      }
      function remove(key) {
        return ls.removeItem(key);
      }
      function clear() {
        return ls.clear();
      }
      function backend(store) {
        store && (ls = store);
        return ls;
      }
      accessor.set = set2;
      accessor.get = get2;
      accessor.remove = remove;
      accessor.clear = clear;
      accessor.backend = backend;
      accessor.on = tracking.on;
      accessor.off = tracking.off;
      module.exports = accessor;
    }
  });

  // node_modules/events/events.js
  var require_events = __commonJS({
    "node_modules/events/events.js"(exports, module) {
      "use strict";
      var R = typeof Reflect === "object" ? Reflect : null;
      var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
        return Function.prototype.apply.call(target, receiver, args);
      };
      var ReflectOwnKeys;
      if (R && typeof R.ownKeys === "function") {
        ReflectOwnKeys = R.ownKeys;
      } else if (Object.getOwnPropertySymbols) {
        ReflectOwnKeys = function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
        };
      } else {
        ReflectOwnKeys = function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target);
        };
      }
      function ProcessEmitWarning(warning) {
        if (console && console.warn)
          console.warn(warning);
      }
      var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
        return value !== value;
      };
      function EventEmitter2() {
        EventEmitter2.init.call(this);
      }
      module.exports = EventEmitter2;
      module.exports.once = once;
      EventEmitter2.EventEmitter = EventEmitter2;
      EventEmitter2.prototype._events = void 0;
      EventEmitter2.prototype._eventsCount = 0;
      EventEmitter2.prototype._maxListeners = void 0;
      var defaultMaxListeners = 10;
      function checkListener(listener) {
        if (typeof listener !== "function") {
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
        }
      }
      Object.defineProperty(EventEmitter2, "defaultMaxListeners", {
        enumerable: true,
        get: function() {
          return defaultMaxListeners;
        },
        set: function(arg) {
          if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
            throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
          }
          defaultMaxListeners = arg;
        }
      });
      EventEmitter2.init = function() {
        if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        }
        this._maxListeners = this._maxListeners || void 0;
      };
      EventEmitter2.prototype.setMaxListeners = function setMaxListeners(n) {
        if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
          throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
        }
        this._maxListeners = n;
        return this;
      };
      function _getMaxListeners(that) {
        if (that._maxListeners === void 0)
          return EventEmitter2.defaultMaxListeners;
        return that._maxListeners;
      }
      EventEmitter2.prototype.getMaxListeners = function getMaxListeners() {
        return _getMaxListeners(this);
      };
      EventEmitter2.prototype.emit = function emit(type) {
        var args = [];
        for (var i = 1; i < arguments.length; i++)
          args.push(arguments[i]);
        var doError = type === "error";
        var events = this._events;
        if (events !== void 0)
          doError = doError && events.error === void 0;
        else if (!doError)
          return false;
        if (doError) {
          var er;
          if (args.length > 0)
            er = args[0];
          if (er instanceof Error) {
            throw er;
          }
          var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
          err.context = er;
          throw err;
        }
        var handler = events[type];
        if (handler === void 0)
          return false;
        if (typeof handler === "function") {
          ReflectApply(handler, this, args);
        } else {
          var len = handler.length;
          var listeners = arrayClone(handler, len);
          for (var i = 0; i < len; ++i)
            ReflectApply(listeners[i], this, args);
        }
        return true;
      };
      function _addListener(target, type, listener, prepend) {
        var m;
        var events;
        var existing;
        checkListener(listener);
        events = target._events;
        if (events === void 0) {
          events = target._events = /* @__PURE__ */ Object.create(null);
          target._eventsCount = 0;
        } else {
          if (events.newListener !== void 0) {
            target.emit(
              "newListener",
              type,
              listener.listener ? listener.listener : listener
            );
            events = target._events;
          }
          existing = events[type];
        }
        if (existing === void 0) {
          existing = events[type] = listener;
          ++target._eventsCount;
        } else {
          if (typeof existing === "function") {
            existing = events[type] = prepend ? [listener, existing] : [existing, listener];
          } else if (prepend) {
            existing.unshift(listener);
          } else {
            existing.push(listener);
          }
          m = _getMaxListeners(target);
          if (m > 0 && existing.length > m && !existing.warned) {
            existing.warned = true;
            var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
            w.name = "MaxListenersExceededWarning";
            w.emitter = target;
            w.type = type;
            w.count = existing.length;
            ProcessEmitWarning(w);
          }
        }
        return target;
      }
      EventEmitter2.prototype.addListener = function addListener(type, listener) {
        return _addListener(this, type, listener, false);
      };
      EventEmitter2.prototype.on = EventEmitter2.prototype.addListener;
      EventEmitter2.prototype.prependListener = function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
      };
      function onceWrapper() {
        if (!this.fired) {
          this.target.removeListener(this.type, this.wrapFn);
          this.fired = true;
          if (arguments.length === 0)
            return this.listener.call(this.target);
          return this.listener.apply(this.target, arguments);
        }
      }
      function _onceWrap(target, type, listener) {
        var state = { fired: false, wrapFn: void 0, target, type, listener };
        var wrapped = onceWrapper.bind(state);
        wrapped.listener = listener;
        state.wrapFn = wrapped;
        return wrapped;
      }
      EventEmitter2.prototype.once = function once2(type, listener) {
        checkListener(listener);
        this.on(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter2.prototype.prependOnceListener = function prependOnceListener(type, listener) {
        checkListener(listener);
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter2.prototype.removeListener = function removeListener(type, listener) {
        var list, events, position, i, originalListener;
        checkListener(listener);
        events = this._events;
        if (events === void 0)
          return this;
        list = events[type];
        if (list === void 0)
          return this;
        if (list === listener || list.listener === listener) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else {
            delete events[type];
            if (events.removeListener)
              this.emit("removeListener", type, list.listener || listener);
          }
        } else if (typeof list !== "function") {
          position = -1;
          for (i = list.length - 1; i >= 0; i--) {
            if (list[i] === listener || list[i].listener === listener) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }
          if (position < 0)
            return this;
          if (position === 0)
            list.shift();
          else {
            spliceOne(list, position);
          }
          if (list.length === 1)
            events[type] = list[0];
          if (events.removeListener !== void 0)
            this.emit("removeListener", type, originalListener || listener);
        }
        return this;
      };
      EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
      EventEmitter2.prototype.removeAllListeners = function removeAllListeners(type) {
        var listeners, events, i;
        events = this._events;
        if (events === void 0)
          return this;
        if (events.removeListener === void 0) {
          if (arguments.length === 0) {
            this._events = /* @__PURE__ */ Object.create(null);
            this._eventsCount = 0;
          } else if (events[type] !== void 0) {
            if (--this._eventsCount === 0)
              this._events = /* @__PURE__ */ Object.create(null);
            else
              delete events[type];
          }
          return this;
        }
        if (arguments.length === 0) {
          var keys = Object.keys(events);
          var key;
          for (i = 0; i < keys.length; ++i) {
            key = keys[i];
            if (key === "removeListener")
              continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners("removeListener");
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
          return this;
        }
        listeners = events[type];
        if (typeof listeners === "function") {
          this.removeListener(type, listeners);
        } else if (listeners !== void 0) {
          for (i = listeners.length - 1; i >= 0; i--) {
            this.removeListener(type, listeners[i]);
          }
        }
        return this;
      };
      function _listeners(target, type, unwrap) {
        var events = target._events;
        if (events === void 0)
          return [];
        var evlistener = events[type];
        if (evlistener === void 0)
          return [];
        if (typeof evlistener === "function")
          return unwrap ? [evlistener.listener || evlistener] : [evlistener];
        return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
      }
      EventEmitter2.prototype.listeners = function listeners(type) {
        return _listeners(this, type, true);
      };
      EventEmitter2.prototype.rawListeners = function rawListeners(type) {
        return _listeners(this, type, false);
      };
      EventEmitter2.listenerCount = function(emitter, type) {
        if (typeof emitter.listenerCount === "function") {
          return emitter.listenerCount(type);
        } else {
          return listenerCount.call(emitter, type);
        }
      };
      EventEmitter2.prototype.listenerCount = listenerCount;
      function listenerCount(type) {
        var events = this._events;
        if (events !== void 0) {
          var evlistener = events[type];
          if (typeof evlistener === "function") {
            return 1;
          } else if (evlistener !== void 0) {
            return evlistener.length;
          }
        }
        return 0;
      }
      EventEmitter2.prototype.eventNames = function eventNames() {
        return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
      };
      function arrayClone(arr, n) {
        var copy = new Array(n);
        for (var i = 0; i < n; ++i)
          copy[i] = arr[i];
        return copy;
      }
      function spliceOne(list, index) {
        for (; index + 1 < list.length; index++)
          list[index] = list[index + 1];
        list.pop();
      }
      function unwrapListeners(arr) {
        var ret = new Array(arr.length);
        for (var i = 0; i < ret.length; ++i) {
          ret[i] = arr[i].listener || arr[i];
        }
        return ret;
      }
      function once(emitter, name) {
        return new Promise(function(resolve, reject) {
          function errorListener(err) {
            emitter.removeListener(name, resolver);
            reject(err);
          }
          function resolver() {
            if (typeof emitter.removeListener === "function") {
              emitter.removeListener("error", errorListener);
            }
            resolve([].slice.call(arguments));
          }
          ;
          eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
          if (name !== "error") {
            addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
          }
        });
      }
      function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
        if (typeof emitter.on === "function") {
          eventTargetAgnosticAddListener(emitter, "error", handler, flags);
        }
      }
      function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
        if (typeof emitter.on === "function") {
          if (flags.once) {
            emitter.once(name, listener);
          } else {
            emitter.on(name, listener);
          }
        } else if (typeof emitter.addEventListener === "function") {
          emitter.addEventListener(name, function wrapListener(arg) {
            if (flags.once) {
              emitter.removeEventListener(name, wrapListener);
            }
            listener(arg);
          });
        } else {
          throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
        }
      }
    }
  });

  // src/lib/data_transporter.ts
  var DataTransporter = class {
    constructor(sender) {
      this.dataList = [];
      this.nextFlashIndex = 0;
      this.flashInterval = 5e3;
      this.flashing = false;
      this.sender = sender;
    }
    push(data) {
      this.dataList.push(data);
    }
    start() {
      this.flash();
      this.tid = setInterval(() => {
        this.flash();
      }, this.flashInterval);
    }
    end() {
      return __async(this, null, function* () {
        if (this.tid) {
          clearInterval(this.tid);
          this.tid = void 0;
        }
        yield this.flash();
      });
    }
    flash() {
      return __async(this, null, function* () {
        if (this.flashing) {
          throw new Error("aleady flashing");
        }
        this.flashing = true;
        const startIndex = this.nextFlashIndex;
        if (this.nextFlashIndex != this.dataList.length) {
          const nextIndex = this.dataList.length;
          const sendData = this.dataList.slice(startIndex, nextIndex);
          const result = yield this.sender.send(sendData);
          if (result)
            this.nextFlashIndex = nextIndex;
          this.flashing = false;
          return result;
        } else {
          this.flashing = false;
          return void 0;
        }
      });
    }
  };

  // src/lib/form_measure.ts
  var import_local_storage = __toESM(require_local_storage());
  var import_events = __toESM(require_events());

  // src/lib/ga_connect.ts
  var GaConnect = class {
    static formSessionStart(e) {
      const event = {
        event: `form_session_start`,
        form_session_id: e.sid,
        form_uid: e.uid
      };
      if (!window.dataLayer)
        window.dataLayer = [];
      window.dataLayer.push(event);
    }
  };

  // node_modules/uuid/dist/esm-browser/rng.js
  var getRandomValues;
  var rnds8 = new Uint8Array(16);
  function rng() {
    if (!getRandomValues) {
      getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== "undefined" && typeof msCrypto.getRandomValues === "function" && msCrypto.getRandomValues.bind(msCrypto);
      if (!getRandomValues) {
        throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      }
    }
    return getRandomValues(rnds8);
  }

  // node_modules/uuid/dist/esm-browser/regex.js
  var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

  // node_modules/uuid/dist/esm-browser/validate.js
  function validate(uuid) {
    return typeof uuid === "string" && regex_default.test(uuid);
  }
  var validate_default = validate;

  // node_modules/uuid/dist/esm-browser/stringify.js
  var byteToHex = [];
  for (i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).substr(1));
  }
  var i;
  function stringify(arr) {
    var offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
    if (!validate_default(uuid)) {
      throw TypeError("Stringified UUID is invalid");
    }
    return uuid;
  }
  var stringify_default = stringify;

  // node_modules/uuid/dist/esm-browser/v4.js
  function v4(options, buf, offset) {
    options = options || {};
    var rnds = options.random || (options.rng || rng)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return stringify_default(rnds);
  }
  var v4_default = v4;

  // src/lib/dom-utils.ts
  var waitAppearTarget = (window2, selector, appearThreshold = 0.4) => {
    return new Promise((resolve, reject) => {
      const targetlement = window2.document.querySelector(selector);
      if (targetlement == null) {
        reject(new Error(`${targetlement} element not found`));
      } else {
        const scrollWatcher = () => {
          if (window2.scrollY + window2.innerHeight * (1 - appearThreshold) > targetlement.offsetTop) {
            resolve();
          }
        };
        window2.addEventListener("scroll", scrollWatcher);
      }
    });
  };
  var getElementValue = (element) => {
    var _a, _b;
    const nodeName = element.nodeName.toUpperCase();
    const type = ((_a = element.getAttribute("type")) == null ? void 0 : _a.toLowerCase()) || null;
    let ret = {};
    if (nodeName == "SELECT") {
      ret = { v: element.value };
    } else if (type == "checkbox") {
      const elm = element;
      ret = { v: elm.value, c: elm.checked };
    } else {
      ret = { v: element.value };
      ret.vl = (_b = ret.v) == null ? void 0 : _b.length;
    }
    return ret;
  };

  // src/lib/http-sender.ts
  var HttpSender = class {
    constructor(props) {
      this.window = props.window;
      this.url = props.url;
    }
    send(dataList) {
      return __async(this, null, function* () {
        const data = new Blob([JSON.stringify(dataList)], {
          type: "application/json"
        });
        return this.window.navigator.sendBeacon(this.url, data);
      });
    }
  };

  // src/lib/debug-sender.ts
  var DebugSender = class {
    send(dataList) {
      return __async(this, null, function* () {
        console.log(JSON.stringify(dataList));
        return true;
      });
    }
  };

  // src/lib/form_measure.ts
  var FormMeasure = class {
    constructor(opt) {
      this.sequence = 0;
      this.eventEmitter = new import_events.default();
      this.sessionId = 0;
      this.appPrefix = "_fe";
      this.window = opt.window;
      if (opt.sendGtagEvent === void 0 || opt.sendGtagEvent === true) {
        this.on("form_session_start", GaConnect.formSessionStart);
      }
      if (opt.localstoragePrefix)
        this.appPrefix = opt.localstoragePrefix;
      this.formSelector = opt.formSelector || "form";
      this.senderUrl = opt.senderUrl;
      this._sender = opt.dataSender;
      this.init();
    }
    sender() {
      if (!this._sender) {
        if (!this.senderUrl) {
          this._sender = new DebugSender();
        } else {
          this._sender = new HttpSender({
            window: this.window,
            url: this.senderUrl
          });
        }
      }
      return this._sender;
    }
    dataTransporter() {
      if (!this._dataTransporter) {
        this._dataTransporter = new DataTransporter(this.sender());
      }
      return this._dataTransporter;
    }
    nextSequence() {
      return this.sequence++;
    }
    nextSessionId() {
      const currentSessionId = (0, import_local_storage.get)(`${this.appPrefix}_sid`) || 0;
      this.sessionId = currentSessionId;
      (0, import_local_storage.set)(`${this.appPrefix}_sid`, this.sessionId + 1);
      return this.sessionId;
    }
    get uid() {
      if (!this._uid) {
        this._uid = (0, import_local_storage.get)(`${this.appPrefix}_uid`);
        if (!this._uid) {
          const idLength = 8;
          const _uuid = v4_default();
          const start = Math.round(
            Math.random() * (_uuid.length > idLength ? _uuid.length - idLength : 0)
          );
          const uuid = _uuid.replace(/-/g, "").substring(start, start + idLength);
          this._uid = `${uuid}.${Math.round(Date.now() / 1e3)}`;
          (0, import_local_storage.set)(`${this.appPrefix}_uid`, this._uid);
        }
      }
      return this._uid;
    }
    emit(eventName, param) {
      var _a;
      const _param = param || {};
      const e = __spreadValues({
        e: eventName,
        i: this.nextSequence(),
        fst: this.formSelector,
        sid: this.sessionId,
        uid: this.uid,
        ts: Date.now()
      }, _param);
      (_a = this.dataTransporter()) == null ? void 0 : _a.push(e);
      this.eventEmitter.emit(eventName, e);
    }
    on(message, cb) {
      this.eventEmitter.on(message, cb);
    }
    init() {
      const document = this.window.document;
      this.window.addEventListener("unload", () => {
        this.end();
      });
      const form = document.querySelector(this.formSelector);
      if (form) {
        document.querySelectorAll(`${this.formSelector} input,select,textarea`).forEach((v, i) => {
          var _a;
          const elemet = v;
          const type = ((_a = elemet.getAttribute("type")) == null ? void 0 : _a.toLowerCase()) || null;
          const nodeName = elemet.nodeName.toUpperCase();
          const name = v.getAttribute("name");
          if (nodeName == "INPUT" && (type == "hidden" || type == null) || !name)
            return;
          const fieldEventEmitter = (e) => {
            const value = getElementValue(elemet);
            if (!(nodeName == "SELECT" || type == "radio" || type == "checkbox")) {
              delete value.v;
            }
            const eventParam = __spreadValues({
              n: name,
              t: type,
              e: e.type,
              nn: nodeName
            }, value);
            this.emit(e.type, eventParam);
          };
          elemet.addEventListener("change", fieldEventEmitter);
          elemet.addEventListener("focus", fieldEventEmitter);
        });
        form.addEventListener("submit", (e) => {
          this.emit("form_submit");
        });
      }
    }
    start() {
      this.sequence = 0;
      this.nextSessionId();
      this.emit("form_session_start", {
        url: this.window.location.href,
        ua: this.window.navigator.userAgent,
        referer: this.window.document.referrer
      });
      if (this.dataTransporter()) {
        this.dataTransporter().flashInterval = 1e4;
        this.dataTransporter().start();
      }
      waitAppearTarget(this.window, this.formSelector).then(() => {
        this.emit("form_appear");
      });
    }
    end() {
      var _a;
      this.emit("form_session_end");
      (_a = this.dataTransporter()) == null ? void 0 : _a.end();
    }
  };
})();
