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
  var WaitAppearTargetTrigger = class {
    constructor() {
      this.testers = [];
      const testrunner = () => {
        this.testers.forEach((tester) => tester());
      };
      this.testrunner = testrunner;
      this.connect(this.testrunner);
    }
    release(tester, targetlement) {
      const index = this.testers.indexOf(tester);
      this.testers.splice(index, 1);
      if (this.testers.length == 0) {
        this.disconnect(this.testrunner);
      }
    }
    connect(testrunner) {
    }
    disconnect(testrunner) {
    }
  };
  var waitAppearTarget = (window2, targetlement, option) => {
    const appearThreshold = option.appearThreshold || 0.4;
    const conditions = option.conditions;
    const trigger = option.trigger;
    const fire = () => {
      const appeard = window2.scrollY + window2.innerHeight * (1 - appearThreshold) > targetlement.offsetTop;
      return appeard && (conditions ? conditions(window2, targetlement) : true);
    };
    return new Promise((resolve, reject) => {
      if (targetlement == null) {
        reject(new Error(`${targetlement} element not found`));
      } else {
        if (fire()) {
          resolve();
        } else {
          const release = (tester2) => {
            trigger == null ? void 0 : trigger.release(tester2, targetlement);
            window2.removeEventListener("scroll", tester2);
          };
          const tester = () => {
            if (fire()) {
              release(tester);
              resolve();
            }
          };
          if (trigger)
            trigger.testers.push(tester);
          window2.addEventListener("scroll", tester);
        }
      }
    });
  };
  var getFieldValue = (element) => {
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
      this.option = props.option;
    }
    send(dataList) {
      return __async(this, null, function* () {
        const url = new URL(this.option.url);
        if (this.option.api_key)
          url.searchParams.set("api_key", this.option.api_key);
        const headers = {
          type: "application/json"
        };
        const data = new Blob([JSON.stringify(dataList)], headers);
        return this.window.navigator.sendBeacon(url.toString(), data);
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

  // node_modules/css-selector-generator/esm/utilities-iselement.js
  function isElement(input) {
    return input && input instanceof Element;
  }

  // node_modules/css-selector-generator/esm/types.js
  var OPERATOR;
  (function(OPERATOR2) {
    OPERATOR2["NONE"] = "none";
    OPERATOR2["DESCENDANT"] = "descendant";
    OPERATOR2["CHILD"] = "child";
  })(OPERATOR || (OPERATOR = {}));
  var CssSelectorType;
  (function(CssSelectorType2) {
    CssSelectorType2["id"] = "id";
    CssSelectorType2["class"] = "class";
    CssSelectorType2["tag"] = "tag";
    CssSelectorType2["attribute"] = "attribute";
    CssSelectorType2["nthchild"] = "nthchild";
    CssSelectorType2["nthoftype"] = "nthoftype";
  })(CssSelectorType || (CssSelectorType = {}));

  // node_modules/css-selector-generator/esm/utilities-typescript.js
  function isEnumValue(haystack, needle) {
    return Object.values(haystack).includes(needle);
  }

  // node_modules/css-selector-generator/esm/utilities-messages.js
  var libraryName = "CssSelectorGenerator";
  function showWarning(id = "unknown problem", ...args) {
    console.warn(`${libraryName}: ${id}`, ...args);
  }

  // node_modules/css-selector-generator/esm/utilities-options.js
  var DEFAULT_OPTIONS = {
    selectors: [
      CssSelectorType.id,
      CssSelectorType.class,
      CssSelectorType.tag,
      CssSelectorType.attribute
    ],
    includeTag: false,
    whitelist: [],
    blacklist: [],
    combineWithinSelector: true,
    combineBetweenSelectors: true,
    root: null,
    maxCombinations: Number.POSITIVE_INFINITY,
    maxCandidates: Number.POSITIVE_INFINITY
  };
  function sanitizeSelectorTypes(input) {
    if (!Array.isArray(input)) {
      return [];
    }
    return input.filter((item) => isEnumValue(CssSelectorType, item));
  }
  function isRegExp(input) {
    return input instanceof RegExp;
  }
  function isCssSelectorMatch(input) {
    return ["string", "function"].includes(typeof input) || isRegExp(input);
  }
  function sanitizeCssSelectorMatchList(input) {
    if (!Array.isArray(input)) {
      return [];
    }
    return input.filter(isCssSelectorMatch);
  }
  function isNode(input) {
    return input instanceof Node;
  }
  function isParentNode(input) {
    const validNodeTypes = [
      Node.DOCUMENT_NODE,
      Node.DOCUMENT_FRAGMENT_NODE,
      Node.ELEMENT_NODE
    ];
    return isNode(input) && validNodeTypes.includes(input.nodeType);
  }
  function sanitizeRoot(input, element) {
    if (isParentNode(input)) {
      if (!input.contains(element)) {
        showWarning("element root mismatch", "Provided root does not contain the element. This will most likely result in producing a fallback selector using element's real root node. If you plan to use the selector using provided root (e.g. `root.querySelector`), it will nto work as intended.");
      }
      return input;
    }
    const rootNode = element.getRootNode({ composed: false });
    if (isParentNode(rootNode)) {
      if (rootNode !== document) {
        showWarning("shadow root inferred", "You did not provide a root and the element is a child of Shadow DOM. This will produce a selector using ShadowRoot as a root. If you plan to use the selector using document as a root (e.g. `document.querySelector`), it will not work as intended.");
      }
      return rootNode;
    }
    return element.ownerDocument.querySelector(":root");
  }
  function sanitizeMaxNumber(input) {
    return typeof input === "number" ? input : Number.POSITIVE_INFINITY;
  }
  function sanitizeOptions(element, custom_options = {}) {
    const options = Object.assign(Object.assign({}, DEFAULT_OPTIONS), custom_options);
    return {
      selectors: sanitizeSelectorTypes(options.selectors),
      whitelist: sanitizeCssSelectorMatchList(options.whitelist),
      blacklist: sanitizeCssSelectorMatchList(options.blacklist),
      root: sanitizeRoot(options.root, element),
      combineWithinSelector: !!options.combineWithinSelector,
      combineBetweenSelectors: !!options.combineBetweenSelectors,
      includeTag: !!options.includeTag,
      maxCombinations: sanitizeMaxNumber(options.maxCombinations),
      maxCandidates: sanitizeMaxNumber(options.maxCandidates)
    };
  }

  // node_modules/css-selector-generator/esm/utilities-data.js
  function getIntersection(items = []) {
    const [firstItem = [], ...otherItems] = items;
    if (otherItems.length === 0) {
      return firstItem;
    }
    return otherItems.reduce((accumulator, currentValue) => {
      return accumulator.filter((item) => currentValue.includes(item));
    }, firstItem);
  }
  function flattenArray(input) {
    return [].concat(...input);
  }
  function wildcardToRegExp(input) {
    return input.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".+");
  }
  function createPatternMatcher(list) {
    const matchFunctions = list.map((item) => {
      if (isRegExp(item)) {
        return (input) => item.test(input);
      }
      if (typeof item === "function") {
        return (input) => {
          const result = item(input);
          if (typeof result !== "boolean") {
            showWarning("pattern matcher function invalid", "Provided pattern matching function does not return boolean. It's result will be ignored.", item);
            return false;
          }
          return result;
        };
      }
      if (typeof item === "string") {
        const re = new RegExp("^" + wildcardToRegExp(item) + "$");
        return (input) => re.test(input);
      }
      showWarning("pattern matcher invalid", "Pattern matching only accepts strings, regular expressions and/or functions. This item is invalid and will be ignored.", item);
      return () => false;
    });
    return (input) => matchFunctions.some((matchFunction) => matchFunction(input));
  }

  // node_modules/css-selector-generator/esm/utilities-dom.js
  function testSelector(elements, selector, root) {
    const result = Array.from(sanitizeRoot(root, elements[0]).querySelectorAll(selector));
    return result.length === elements.length && elements.every((element) => result.includes(element));
  }
  function getElementParents(element, root) {
    root = root !== null && root !== void 0 ? root : getRootNode(element);
    const result = [];
    let parent = element;
    while (isElement(parent) && parent !== root) {
      result.push(parent);
      parent = parent.parentElement;
    }
    return result;
  }
  function getParents(elements, root) {
    return getIntersection(elements.map((element) => getElementParents(element, root)));
  }
  function getRootNode(element) {
    return element.ownerDocument.querySelector(":root");
  }

  // node_modules/css-selector-generator/esm/constants.js
  var NONE_OPERATOR = "";
  var DESCENDANT_OPERATOR = " > ";
  var CHILD_OPERATOR = " ";
  var OPERATOR_DATA = {
    [OPERATOR.NONE]: {
      type: OPERATOR.NONE,
      value: NONE_OPERATOR
    },
    [OPERATOR.DESCENDANT]: {
      type: OPERATOR.DESCENDANT,
      value: DESCENDANT_OPERATOR
    },
    [OPERATOR.CHILD]: {
      type: OPERATOR.CHILD,
      value: CHILD_OPERATOR
    }
  };
  var SELECTOR_SEPARATOR = ", ";
  var INVALID_ID_RE = new RegExp([
    "^$",
    "\\s"
  ].join("|"));
  var INVALID_CLASS_RE = new RegExp([
    "^$"
  ].join("|"));
  var SELECTOR_PATTERN = [
    CssSelectorType.nthoftype,
    CssSelectorType.tag,
    CssSelectorType.id,
    CssSelectorType.class,
    CssSelectorType.attribute,
    CssSelectorType.nthchild
  ];

  // node_modules/css-selector-generator/esm/selector-attribute.js
  var attributeBlacklistMatch = createPatternMatcher([
    "class",
    "id",
    "ng-*"
  ]);
  function attributeNodeToSimplifiedSelector({ nodeName }) {
    return `[${nodeName}]`;
  }
  function attributeNodeToSelector({ nodeName, nodeValue }) {
    const selector = `[${nodeName}='${sanitizeSelectorItem(nodeValue)}']`;
    return selector;
  }
  function isValidAttributeNode({ nodeName }, element) {
    const tagName = element.tagName.toLowerCase();
    if (["input", "option"].includes(tagName) && nodeName === "value") {
      return false;
    }
    return !attributeBlacklistMatch(nodeName);
  }
  function getElementAttributeSelectors(element) {
    const validAttributes = Array.from(element.attributes).filter((attributeNode) => isValidAttributeNode(attributeNode, element));
    return [
      ...validAttributes.map(attributeNodeToSimplifiedSelector),
      ...validAttributes.map(attributeNodeToSelector)
    ];
  }
  function getAttributeSelectors(elements) {
    const elementSelectors = elements.map(getElementAttributeSelectors);
    return getIntersection(elementSelectors);
  }

  // node_modules/css-selector-generator/esm/selector-class.js
  function getElementClassSelectors(element) {
    return (element.getAttribute("class") || "").trim().split(/\s+/).filter((item) => !INVALID_CLASS_RE.test(item)).map((item) => `.${sanitizeSelectorItem(item)}`);
  }
  function getClassSelectors(elements) {
    const elementSelectors = elements.map(getElementClassSelectors);
    return getIntersection(elementSelectors);
  }

  // node_modules/css-selector-generator/esm/selector-id.js
  function getElementIdSelectors(element) {
    const id = element.getAttribute("id") || "";
    const selector = `#${sanitizeSelectorItem(id)}`;
    const rootNode = element.getRootNode({ composed: false });
    return !INVALID_ID_RE.test(id) && testSelector([element], selector, rootNode) ? [selector] : [];
  }
  function getIdSelector(elements) {
    return elements.length === 0 || elements.length > 1 ? [] : getElementIdSelectors(elements[0]);
  }

  // node_modules/css-selector-generator/esm/selector-nth-child.js
  function getElementNthChildSelector(element) {
    const parent = element.parentNode;
    if (parent) {
      const siblings = Array.from(parent.childNodes).filter(isElement);
      const elementIndex = siblings.indexOf(element);
      if (elementIndex > -1) {
        return [`:nth-child(${elementIndex + 1})`];
      }
    }
    return [];
  }
  function getNthChildSelector(elements) {
    return getIntersection(elements.map(getElementNthChildSelector));
  }

  // node_modules/css-selector-generator/esm/selector-tag.js
  function getElementTagSelectors(element) {
    return [
      sanitizeSelectorItem(element.tagName.toLowerCase())
    ];
  }
  function getTagSelector(elements) {
    const selectors = [
      ...new Set(flattenArray(elements.map(getElementTagSelectors)))
    ];
    return selectors.length === 0 || selectors.length > 1 ? [] : [selectors[0]];
  }

  // node_modules/css-selector-generator/esm/selector-nth-of-type.js
  function getElementNthOfTypeSelector(element) {
    const tag = getTagSelector([element])[0];
    const parentElement = element.parentElement;
    if (parentElement) {
      const siblings = Array.from(parentElement.children).filter((element2) => element2.tagName.toLowerCase() === tag);
      const elementIndex = siblings.indexOf(element);
      if (elementIndex > -1) {
        return [`${tag}:nth-of-type(${elementIndex + 1})`];
      }
    }
    return [];
  }
  function getNthOfTypeSelector(elements) {
    return getIntersection(elements.map(getElementNthOfTypeSelector));
  }

  // node_modules/css-selector-generator/esm/utilities-powerset.js
  function getPowerSet(input = [], { maxResults = Number.POSITIVE_INFINITY } = {}) {
    const result = [];
    let resultCounter = 0;
    let offsets = generateOffsets(1);
    while (offsets.length <= input.length && resultCounter < maxResults) {
      resultCounter += 1;
      result.push(offsets.map((offset) => input[offset]));
      offsets = bumpOffsets(offsets, input.length - 1);
    }
    return result;
  }
  function bumpOffsets(offsets = [], maxValue = 0) {
    const size = offsets.length;
    if (size === 0) {
      return [];
    }
    const result = [...offsets];
    result[size - 1] += 1;
    for (let index = size - 1; index >= 0; index--) {
      if (result[index] > maxValue) {
        if (index === 0) {
          return generateOffsets(size + 1);
        } else {
          result[index - 1]++;
          result[index] = result[index - 1] + 1;
        }
      }
    }
    if (result[size - 1] > maxValue) {
      return generateOffsets(size + 1);
    }
    return result;
  }
  function generateOffsets(size = 1) {
    return Array.from(Array(size).keys());
  }

  // node_modules/css-selector-generator/esm/utilities-cartesian.js
  function getCartesianProduct(input = {}) {
    let result = [];
    Object.entries(input).forEach(([key, values]) => {
      result = values.flatMap((value) => {
        if (result.length === 0) {
          return [{ [key]: value }];
        } else {
          return result.map((memo) => Object.assign(Object.assign({}, memo), { [key]: value }));
        }
      });
    });
    return result;
  }

  // node_modules/css-selector-generator/esm/utilities-selectors.js
  var ESCAPED_COLON = ":".charCodeAt(0).toString(16).toUpperCase();
  var SPECIAL_CHARACTERS_RE = /[ !"#$%&'()\[\]{|}<>*+,./;=?@^`~\\]/;
  function sanitizeSelectorItem(input = "") {
    var _a, _b;
    return (_b = (_a = CSS === null || CSS === void 0 ? void 0 : CSS.escape) === null || _a === void 0 ? void 0 : _a.call(CSS, input)) !== null && _b !== void 0 ? _b : legacySanitizeSelectorItem(input);
  }
  function legacySanitizeSelectorItem(input = "") {
    return input.split("").map((character) => {
      if (character === ":") {
        return `\\${ESCAPED_COLON} `;
      }
      if (SPECIAL_CHARACTERS_RE.test(character)) {
        return `\\${character}`;
      }
      return escape(character).replace(/%/g, "\\");
    }).join("");
  }
  var SELECTOR_TYPE_GETTERS = {
    tag: getTagSelector,
    id: getIdSelector,
    class: getClassSelectors,
    attribute: getAttributeSelectors,
    nthchild: getNthChildSelector,
    nthoftype: getNthOfTypeSelector
  };
  var ELEMENT_SELECTOR_TYPE_GETTERS = {
    tag: getElementTagSelectors,
    id: getElementIdSelectors,
    class: getElementClassSelectors,
    attribute: getElementAttributeSelectors,
    nthchild: getElementNthChildSelector,
    nthoftype: getElementNthOfTypeSelector
  };
  function getElementSelectorsByType(element, selectorType) {
    return ELEMENT_SELECTOR_TYPE_GETTERS[selectorType](element);
  }
  function getSelectorsByType(elements, selector_type) {
    var _a;
    const getter = (_a = SELECTOR_TYPE_GETTERS[selector_type]) !== null && _a !== void 0 ? _a : () => [];
    return getter(elements);
  }
  function filterSelectors(list = [], matchBlacklist, matchWhitelist) {
    return list.filter((item) => matchWhitelist(item) || !matchBlacklist(item));
  }
  function orderSelectors(list = [], matchWhitelist) {
    return list.sort((a, b) => {
      const a_is_whitelisted = matchWhitelist(a);
      const b_is_whitelisted = matchWhitelist(b);
      if (a_is_whitelisted && !b_is_whitelisted) {
        return -1;
      }
      if (!a_is_whitelisted && b_is_whitelisted) {
        return 1;
      }
      return 0;
    });
  }
  function getAllSelectors(elements, root, options) {
    const selectors_list = getSelectorsList(elements, options);
    const type_combinations = getTypeCombinations(selectors_list, options);
    const all_selectors = flattenArray(type_combinations);
    return [...new Set(all_selectors)];
  }
  function getSelectorsList(elements, options) {
    const { blacklist, whitelist, combineWithinSelector, maxCombinations } = options;
    const matchBlacklist = createPatternMatcher(blacklist);
    const matchWhitelist = createPatternMatcher(whitelist);
    const reducer = (data, selector_type) => {
      const selectors_by_type = getSelectorsByType(elements, selector_type);
      const filtered_selectors = filterSelectors(selectors_by_type, matchBlacklist, matchWhitelist);
      const found_selectors = orderSelectors(filtered_selectors, matchWhitelist);
      data[selector_type] = combineWithinSelector ? getPowerSet(found_selectors, { maxResults: maxCombinations }) : found_selectors.map((item) => [item]);
      return data;
    };
    return getSelectorsToGet(options).reduce(reducer, {});
  }
  function getSelectorsToGet(options) {
    const { selectors, includeTag } = options;
    const selectors_to_get = [].concat(selectors);
    if (includeTag && !selectors_to_get.includes("tag")) {
      selectors_to_get.push("tag");
    }
    return selectors_to_get;
  }
  function addTagTypeIfNeeded(list) {
    return list.includes(CssSelectorType.tag) || list.includes(CssSelectorType.nthoftype) ? [...list] : [...list, CssSelectorType.tag];
  }
  function combineSelectorTypes(options) {
    const { selectors, combineBetweenSelectors, includeTag, maxCandidates } = options;
    const combinations = combineBetweenSelectors ? getPowerSet(selectors, { maxResults: maxCandidates }) : selectors.map((item) => [item]);
    return includeTag ? combinations.map(addTagTypeIfNeeded) : combinations;
  }
  function getTypeCombinations(selectors_list, options) {
    return combineSelectorTypes(options).map((item) => {
      return constructSelectors(item, selectors_list);
    }).filter((item) => item.length > 0);
  }
  function constructSelectors(selector_types, selectors_by_type) {
    const data = {};
    selector_types.forEach((selector_type) => {
      const selector_variants = selectors_by_type[selector_type];
      if (selector_variants.length > 0) {
        data[selector_type] = selector_variants;
      }
    });
    const combinations = getCartesianProduct(data);
    return combinations.map(constructSelector);
  }
  function constructSelectorType(selector_type, selectors_data) {
    return selectors_data[selector_type] ? selectors_data[selector_type].join("") : "";
  }
  function constructSelector(selectorData = {}) {
    const pattern = [...SELECTOR_PATTERN];
    if (selectorData[CssSelectorType.tag] && selectorData[CssSelectorType.nthoftype]) {
      pattern.splice(pattern.indexOf(CssSelectorType.tag), 1);
    }
    return pattern.map((type) => constructSelectorType(type, selectorData)).join("");
  }
  function generateCandidateCombinations(selectors, rootSelector) {
    return [
      ...selectors.map((selector) => rootSelector + CHILD_OPERATOR + selector),
      ...selectors.map((selector) => rootSelector + DESCENDANT_OPERATOR + selector)
    ];
  }
  function generateCandidates(selectors, rootSelector) {
    return rootSelector === "" ? selectors : generateCandidateCombinations(selectors, rootSelector);
  }
  function getSelectorWithinRoot(elements, root, rootSelector = "", options) {
    const elementSelectors = getAllSelectors(elements, options.root, options);
    const selectorCandidates = generateCandidates(elementSelectors, rootSelector);
    for (const candidateSelector of selectorCandidates) {
      if (testSelector(elements, candidateSelector, options.root)) {
        return candidateSelector;
      }
    }
    return null;
  }
  function getClosestIdentifiableParent(elements, root, rootSelector = "", options) {
    if (elements.length === 0) {
      return null;
    }
    const candidatesList = [
      elements.length > 1 ? elements : [],
      ...getParents(elements, root).map((element) => [element])
    ];
    for (const currentElements of candidatesList) {
      const result = getSelectorWithinRoot(currentElements, root, rootSelector, options);
      if (result) {
        return {
          foundElements: currentElements,
          selector: result
        };
      }
    }
    return null;
  }
  function sanitizeSelectorNeedle(needle) {
    const elements = (Array.isArray(needle) ? needle : [needle]).filter(isElement);
    return [...new Set(elements)];
  }

  // node_modules/css-selector-generator/esm/utilities-element-data.js
  function createElementSelectorData(selector) {
    return {
      value: selector,
      include: false
    };
  }
  function createElementData(element, selectorTypes, operator = OPERATOR.NONE) {
    const selectors = {};
    selectorTypes.forEach((selectorType) => {
      Reflect.set(selectors, selectorType, getElementSelectorsByType(element, selectorType).map(createElementSelectorData));
    });
    return {
      element,
      operator: OPERATOR_DATA[operator],
      selectors
    };
  }
  function constructElementSelector({ selectors, operator }) {
    let pattern = [...SELECTOR_PATTERN];
    if (selectors[CssSelectorType.tag] && selectors[CssSelectorType.nthoftype]) {
      pattern = pattern.filter((item) => item !== CssSelectorType.tag);
    }
    let selector = "";
    pattern.forEach((selectorType) => {
      const selectorsOfType = selectors[selectorType] || [];
      selectorsOfType.forEach(({ value, include }) => {
        if (include) {
          selector += value;
        }
      });
    });
    return operator.value + selector;
  }

  // node_modules/css-selector-generator/esm/selector-fallback.js
  function getElementFallbackSelector(element) {
    const parentElements = getElementParents(element).reverse();
    const elementsData = parentElements.map((element2) => {
      const elementData = createElementData(element2, [CssSelectorType.nthchild], OPERATOR.DESCENDANT);
      elementData.selectors.nthchild.forEach((selectorData) => {
        selectorData.include = true;
      });
      return elementData;
    });
    return [":root", ...elementsData.map(constructElementSelector)].join("");
  }
  function getFallbackSelector(elements) {
    return elements.map(getElementFallbackSelector).join(SELECTOR_SEPARATOR);
  }

  // node_modules/css-selector-generator/esm/index.js
  function getCssSelector(needle, custom_options = {}) {
    const elements = sanitizeSelectorNeedle(needle);
    const options = sanitizeOptions(elements[0], custom_options);
    let partialSelector = "";
    let currentRoot = options.root;
    function updateIdentifiableParent() {
      return getClosestIdentifiableParent(elements, currentRoot, partialSelector, options);
    }
    let closestIdentifiableParent = updateIdentifiableParent();
    while (closestIdentifiableParent) {
      const { foundElements, selector } = closestIdentifiableParent;
      if (testSelector(elements, selector, options.root)) {
        return selector;
      }
      currentRoot = foundElements[0];
      partialSelector = selector;
      closestIdentifiableParent = updateIdentifiableParent();
    }
    if (elements.length > 1) {
      return elements.map((element) => getCssSelector(element, options)).join(SELECTOR_SEPARATOR);
    }
    return getFallbackSelector(elements);
  }

  // src/lib/form_measure.ts
  var FormMeasure = class {
    constructor(opt) {
      this.sequence = 0;
      this.eventEmitter = new import_events.default();
      this.sessionId = 0;
      this.appPrefix = "_fe";
      this.formAvailable = false;
      this.window = opt.window;
      if (opt.sendGtagEvent === void 0 || opt.sendGtagEvent === true) {
        this.on("form_session_start", GaConnect.formSessionStart);
      }
      if (opt.localstoragePrefix)
        this.appPrefix = opt.localstoragePrefix;
      this.formSelector = opt.formSelector || "form";
      this.httpSenderOption = opt.httpSenderOption;
      this._sender = opt.dataSender;
      this.waitAppearTargetOption = opt.waitAppearTargetOption || {};
    }
    sender() {
      if (!this._sender) {
        if (!this.httpSenderOption) {
          this._sender = new DebugSender();
        } else {
          this._sender = new HttpSender({
            window: this.window,
            option: this.httpSenderOption
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
    incrementSequence() {
      return this.sequence++;
    }
    incrementSessionId() {
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
        i: this.incrementSequence(),
        fst: this.formSelector,
        sid: this.sessionId,
        uid: this.uid,
        ts: Date.now()
      }, _param);
      console.debug("form measure event emitted", e);
      (_a = this.dataTransporter()) == null ? void 0 : _a.push(e);
      this.eventEmitter.emit(eventName, e);
    }
    on(message, cb) {
      this.eventEmitter.on(message, cb);
    }
    start() {
      const document2 = this.window.document;
      const formList = document2.querySelectorAll(this.formSelector);
      if (formList.length > 0) {
        this.formAvailable = true;
      }
      if (!this.formAvailable)
        return false;
      this.window.addEventListener("unload", () => {
        var _a;
        this.emit("form_session_end");
        (_a = this.dataTransporter()) == null ? void 0 : _a.end();
      });
      this.sequence = 0;
      this.incrementSessionId();
      formList.forEach((_form, i) => {
        const form = _form;
        const fid = this.getFormId(form, i);
        this.emit("form_session_start", this.getFormProps(form, fid));
        const fieldEventEmitter = (e) => {
          const props = this.sanitaizeFieldProps(
            this.getFieldProps(e.target)
          );
          this.emit(e.type, __spreadValues({ fid }, props));
        };
        form.querySelectorAll("input,select,textarea").forEach((v) => {
          const elemet = v;
          elemet.addEventListener("change", fieldEventEmitter);
          elemet.addEventListener("focus", fieldEventEmitter);
        });
        form.addEventListener("submit", (e) => {
          this.emit("form_submit", this.getFormProps(form, fid));
        });
        waitAppearTarget(this.window, form, this.waitAppearTargetOption).then(
          () => {
            this.emit("form_appear", this.getFormProps(form, fid));
          }
        );
      });
      if (this.dataTransporter()) {
        this.dataTransporter().flashInterval = 1e4;
        this.dataTransporter().start();
      }
      return true;
    }
    getFormId(form, index = 0) {
      return form.getAttribute("id") ? `form#${form.getAttribute("id")}` : form.getAttribute("name") ? `form[name='${form.getAttribute("name")}']` : form.getAttribute("class") ? `form.${form.getAttribute("class")}` : form.getAttribute("action") ? `form[action='${form.getAttribute("action")}']` : `FORM_INDEX[${index}]`;
    }
    getFormProps(form, fid, samitized = true) {
      return {
        url: this.window.location.href,
        ua: this.window.navigator.userAgent,
        referer: this.window.document.referrer,
        fda: this.getFormDataSanitaized(form),
        fid
      };
    }
    getFormDataSanitaized(form) {
      return this.getFormData(form).map(
        (props) => this.sanitaizeFieldProps(props)
      );
    }
    getFormData(form) {
      const ret = [];
      form == null ? void 0 : form.querySelectorAll(`input,select,textarea`).forEach((_elemet) => {
        const elemet = _elemet;
        const props = this.getFieldProps(elemet);
        ret.push(props);
      });
      return ret;
    }
    getFieldProps(element) {
      var _a;
      const type = ((_a = element.getAttribute("type")) == null ? void 0 : _a.toLowerCase()) || null;
      const nodeName = element.nodeName.toUpperCase();
      const name = element.getAttribute("name") || getCssSelector(element);
      const value = getFieldValue(element);
      const props = __spreadValues({
        n: name,
        t: type,
        nn: nodeName
      }, value);
      return props;
    }
    sanitaizeFieldProps(e) {
      if (e.nn != "SELECT" && e.t != "radio" && e.t != "checkbox") {
        delete e.v;
      }
      return e;
    }
  };
})();
//# sourceMappingURL=index.js.map
