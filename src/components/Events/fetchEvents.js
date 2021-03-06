const dateFormat = require('dateformat');

const fetchEvents = async (startDate, selectedSocs, options={showAll: false, before: 0}) => {
  console.log( "arr ", JSON.stringify([...selectedSocs]) )
  
  let data

  let url = window.location.origin + `/api/eventdata?date=${startDate}`
  
  //optional "VIEW_ALL" element within society IDs
  if (!options.showAll)
    url = url + `&socs=${JSON.stringify([...selectedSocs])}`
  
  //optional: search backwards in time for ${options.before} events
  if (options.before)
    url = url + `&before=${options.before}`
    
  data = await fetch(url);
      
  let events    = await data.json()

  if (!events.err & !events.error)
    events = events.map(event => ({
      ...event, 
      date: new Date(event.date)
    }));

  console.log(events)
  return events
}

export default fetchEvents