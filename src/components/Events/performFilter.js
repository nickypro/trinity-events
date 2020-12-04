import timeFunc from '../../functions/timeFunctions'
const today = timeFunc.startOfToday

//FILTER BY USER SETTINGS
const performFilter = (startDate, inputSearchTerm, resetSearch=false) => {
    
    //test search speed
    var t0 = performance.now() 

    //filter by date, which may have just been reset
    let date = (inputs.resetSearch) ? today() : startDate
    let events = rawEventData.filter(event => (date < event.date))

    //filter by what is in the search bar, unless we have just reset search bar
    if (inputSearchTerm && !resetSearch){

      const searchTerm = inputSearchTerm.toLowerCase()
      
      //we check the title, location and the society names
      events = events.filter(event => {        
        return (
             !!event.title.toLowerCase().match(searchTerm)
          || !!event.location.toLowerCase().match(searchTerm)
          || !!event.societyNames.toString().toLowerCase().match(searchTerm)
        ) 
      }) 
      events.searchTerm = searchTerm
    }

    //conclude speed test
    var t1 = performance.now()
    console.log("Filtering took " + (t1 - t0) + " milliseconds.")

    //return events to state
    console.log(`after filter: ${events.length} events`)

    return events
  }

export default performFilter