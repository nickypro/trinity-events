"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var dateFormat = require('dateformat');

var fetchEvents = function fetchEvents(startDate, selectedSocs) {
  var showAll,
      data,
      events,
      _args = arguments;
  return regeneratorRuntime.async(function fetchEvents$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          showAll = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
          console.log("arr ", JSON.stringify(_toConsumableArray(selectedSocs)));

          if (!showAll) {
            _context.next = 8;
            break;
          }

          _context.next = 5;
          return regeneratorRuntime.awrap(fetch(window.location.origin + "/api/eventdata?date=".concat(startDate)));

        case 5:
          data = _context.sent;
          _context.next = 11;
          break;

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(fetch(window.location.origin + "/api/eventdata?date=".concat(startDate, "&socs=").concat(JSON.stringify(_toConsumableArray(selectedSocs)))));

        case 10:
          data = _context.sent;

        case 11:
          _context.next = 13;
          return regeneratorRuntime.awrap(data.json());

        case 13:
          events = _context.sent;
          if (!events.err & !events.error) events = events.map(function (event) {
            return _objectSpread({}, event, {
              date: new Date(event.date)
            });
          });
          console.log(events);
          return _context.abrupt("return", events);

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
};

var _default = fetchEvents;
exports["default"] = _default;