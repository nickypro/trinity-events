"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getEventsFromMySQL = function getEventsFromMySQL(db, startDate) {
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    selectedSocieties: [],
    before: 0
  };
  //get events from database 
  var getAll = options.selectedSocieties.length === 0;
  db.query("\n  SELECT\n    e.*,\n    CAST(concat('[', group_concat(json_quote(s.name) ORDER BY s.name SEPARATOR ','), ']') as json) AS societyNames,\n    CAST(concat('[', group_concat(s.id ORDER BY s.id SEPARATOR ','), ']') as json) AS societyIds\n  FROM\n    events e\n    INNER JOIN society_event se\n      ON se.event_id = e.id\n    INNER JOIN societies s\n      ON s.id = se.society_id\n  WHERE\n    ".concat(getAll ? "" : "s.id in (?) AND", "\n    e.date ").concat(options.before ? '<=' : '>', " '").concat(startDate, " 00:00:00'\n  ").concat(options.before && "ORDER BY e.date DESC LIMIT ".concat(options.before), "\n\n  GROUP BY\n    e.id\n  "), getAll ? [] : options.selectedSocieties, function (err, results, fields) {
    if (err) return console.log(" - Error getting events from MySQL ", err.message);
    console.log(" - Got events for ".concat(options.selectedSocieties.length === 0 ? "all societeies" : options.selectedSocieties, "."));
    var events = results.map(function (event) {
      return _objectSpread({}, event, {
        societyNames: JSON.parse(event.societyNames),
        societyIds: JSON.parse(event.societyIds)
      });
    }).sort(function (ev1, ev2) {
      return Number(ev1.date) - Number(ev2.date);
    });
    callback(events);
    return events;
  });
};

module.exports = getEventsFromMySQL;