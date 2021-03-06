"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _timeFunctions = _interopRequireDefault(require("../../functions/timeFunctions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var today = _timeFunctions["default"].startOfToday; //FILTER BY USER SETTINGS

var performFilter = function performFilter(rawEventData, startDate, inputSearchTerm) {
  var resetSearch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  //test search speed
  var t0 = performance.now(); //filter by date, which may have just been reset

  var date = resetSearch ? today() : startDate;
  var events = rawEventData.filter(function (event) {
    return date < event.date;
  }); //filter by what is in the search bar, unless we have just reset search bar

  if (inputSearchTerm && !resetSearch) {
    var searchTerm = inputSearchTerm.toLowerCase(); //we check the title, location and the society names

    events = events.filter(function (event) {
      return !!event.title.toLowerCase().match(searchTerm) || !!event.location.toLowerCase().match(searchTerm) || !!event.societyNames.toString().toLowerCase().match(searchTerm);
    });
    events.searchTerm = searchTerm;
  } //conclude speed test


  var t1 = performance.now();
  console.log("Filtering took " + (t1 - t0) + " milliseconds."); //return events to state

  console.log("after filter: ".concat(events.length, " events"));
  return events;
};

var _default = performFilter;
exports["default"] = _default;