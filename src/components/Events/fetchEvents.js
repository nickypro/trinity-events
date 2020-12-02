const dateFormat = require('dateformat');

const fetchEvents = async (startDate, selectedSocs, showAll=false) => {
  console.log( "arr ", JSON.stringify([...selectedSocs]) )
  
  let data

  //optional "VIEW_ALL" element within society IDs
  if (showAll)
      data = await fetch(window.location.origin + `/api/eventdata?date=${startDate}`);
  else
      data = await fetch(window.location.origin + `/api/eventdata?date=${startDate}&socs=${JSON.stringify([...selectedSocs])}`);
      
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