const getEventsFromMySQL = require('../functions/getEventsFromMySQL')

function doIntersect(shortArr, longArr) {
  var setA = new Set(shortArr);
  var setB = new Set(longArr);
  const ans = [...setA].filter(x => setB.has(x))
  return !( ans.length == 0 );
}

const sendEventData = async (req, res, connection, eventsFromToday, todayStringYMD, log = () => {}) => {
  const startDate = (req.query.date && req.query.date.match(/\d{4}-\d{2}-\d{2}/)) ? req.query.date : todayStringYMD()
  
  let selected = []
  if (req.query.socs) selected = await JSON.parse(req.query.socs)
  if (selected.length == 0 | !Array.isArray(selected)) {
    console.log(" - selected societies has length zero - sending for all societies")
    log(" - selected societies has length zero - sending for all societies")
    selected = []
  }

  if (startDate === todayStringYMD()) {
    if (selected.length == 0) {
      console.log(` - sending ${eventsFromToday.length} default events starting from today`)
      log(` - sending ${eventsFromToday.length} default events starting from today`)
      res.json(eventsFromToday);

    } else {
      console.log(` - sending filtered events starting from today`)
      log(` - sending filtered events starting from today`)
      selectedIds = new Set(selected)
      res.json(eventsFromToday.filter( event => doIntersect(event.societyIds, selected) ))
    }
  } else {
    console.log(` - performing manual database search for ${startDate}`)
    log(` - performing manual database search for ${startDate}`)
    getEventsFromMySQL(connection, startDate, (eventsRecieved) => {
      res.json(eventsRecieved)
    }, {selectedSocieties: selected})
  }
}

module.exports = sendEventData