"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var getEventsFromMySQL = require('../functions/getEventsFromMySQL');

function doIntersect(shortArr, longArr) {
  var setA = new Set(shortArr);
  var setB = new Set(longArr);

  var ans = _toConsumableArray(setA).filter(function (x) {
    return setB.has(x);
  });

  return !(ans.length == 0);
}

var sendEventData = function sendEventData(req, res, connection, eventsFromToday, todayStringYMD) {
  var log,
      startDate,
      selected,
      _args = arguments;
  return regeneratorRuntime.async(function sendEventData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          log = _args.length > 5 && _args[5] !== undefined ? _args[5] : function () {};
          startDate = req.query.date && req.query.date.match(/\d{4}-\d{2}-\d{2}/) ? req.query.date : todayStringYMD();
          selected = [];

          if (!req.query.socs) {
            _context.next = 7;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(JSON.parse(req.query.socs));

        case 6:
          selected = _context.sent;

        case 7:
          if (selected.length == 0 | !Array.isArray(selected)) {
            console.log(" - selected societies has length zero - sending for all societies");
            log(" - selected societies has length zero - sending for all societies");
            selected = [];
          }

          if (startDate === todayStringYMD()) {
            if (selected.length == 0) {
              console.log(" - sending ".concat(eventsFromToday.length, " default events starting from today"));
              log(" - sending ".concat(eventsFromToday.length, " default events starting from today"));
              res.json(eventsFromToday);
            } else {
              console.log(" - sending filtered events starting from today");
              log(" - sending filtered events starting from today");
              selectedIds = new Set(selected);
              res.json(eventsFromToday.filter(function (event) {
                return doIntersect(event.societyIds, selected);
              }));
            }
          } else {
            console.log(" - performing manual database search for ".concat(startDate));
            log(" - performing manual database search for ".concat(startDate));
            getEventsFromMySQL(connection, startDate, function (eventsRecieved) {
              res.json(eventsRecieved);
            }, {
              selectedSocieties: selected
            });
          }

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = sendEventData;