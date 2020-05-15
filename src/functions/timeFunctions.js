const dateFormat = require('dateformat');

const isValidDate = (d) => ( d instanceof Date && !isNaN(d) )

export default {
  toWeekday : (t) => dateFormat(t, "ddd"),
  toMon     : (t) => dateFormat(t, "mmmm"),
  toDay     : (t) => dateFormat(t, "dS"),
  toTime    : (t) => dateFormat(t, "HH:MM"), /*"h:MM TT"*/
  SqlDateString: (t) => dateFormat(t, "yyyy-mm-dd"),
  toNum     : (t) => Number(new Date(t)),
  startOfToday : () => new Date(dateFormat(new Date(), "dd mmm yyyy")),
  datesAreOnSameDay: (first, second) => {    
    return (isValidDate(first) && 
            isValidDate(second) &&
            first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate() )
  },
  timeout: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  isValidDate,
}
