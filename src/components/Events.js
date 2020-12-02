import "./Event/Event.css"
import React, {useState, useEffect, useContext} from 'react'
import Loading from './LoadingBar'
import Event from './Event'
import DatePicker from './DatePicker'

import {Link} from 'react-router-dom';
import timeFunc from '../functions/timeFunctions'
import {SelectedSocsContext} from '../App'

const dateFormat = require('dateformat');
const today = timeFunc.startOfToday
let prevSearchDate

function Events(props = {
    showAll: false, 
    socs: [], 
    date: false,
  }) {

  const [userSelectedSocs, /*setSelectedSocs*/] = useContext(SelectedSocsContext)
  const [rawEventData, setRawEventData] = useState([]); // raw unfiltered events (to avoid api calls)
  const [events, setEvents] = useState([]); // filtered events (to show to user)
  const [userEventFilters, setUserEventFilters] = useState( defaultFilters )
  
  const showingAllEvent = props.showAll  
  let selectedSocs

  if (props.socs.length > 0) {
    selectedSocs = new Set(props.socs)  
  } else {
    selectedSocs = userSelectedSocs
  }

  const defaultFilters = {
    "startDate": new Date(props.date) || today(),
    "searchTerm": "",
  }

  const fetchEvents = async (inputs = {}) => {
    console.log( "arr ", JSON.stringify([...selectedSocs]) )
    
    const startDate = inputs.startDate || userEventFilters.startDate
    const date =  dateFormat(startDate, "yyyy-mm-dd");
    prevSearchDate = new Date(date);
    
    let data

    //optional "VIEW_ALL" element within society IDs
    if (showingAllEvent)
      data = await fetch(window.location.origin + `/api/eventdata?date=${date}`);
    else
      data = await fetch(window.location.origin + `/api/eventdata?date=${date}&socs=${JSON.stringify([...selectedSocs])}`);
      
    let events    = await data.json()

    if (!events.err & !events.error)
      events = events.map(event => ({
        ...event, 
        date: new Date(event.date)
      }));

    console.log(events)
    setRawEventData(events)
    return 0;
  }
  
  useEffect(() => {
    fetchEvents()
  }, [] );


  const handleFilterChange = (e) => {
    switch(e.target.name){
      case "searchTerm":
        setUserEventFilters({...userEventFilters, searchTerm: e.target.value })
        break;
      
      case "clearSearch":
        setUserEventFilters( defaultFilters )
        performFilter({resetSearch: true})
        break;

      default:
        break;
    }
    
  }
  
  const handleDateChange = (date) => {
    //update user filters store
    setUserEventFilters({...userEventFilters, startDate: date})
    submitSearch({startDate: date})
  }

  //
  const submitSearch = async (inputs = {}) => {
    //ensure picked date is valid
    if ( !inputs.resetSearch 
      && !timeFunc.isValidDate(userEventFilters.startDate)
      && !timeFunc.isValidDate(inputs.startDate)
    ) return
    const startDate = inputs.startDate || userEventFilters.startDate
    console.log(startDate)

    //if different start date
    if ( startDate < prevSearchDate ) {
      await fetchEvents({startDate})
    }

    performFilter(inputs)
  }

  //FILTER BY USER SETTINGS
  const performFilter = (inputs = {resetSearch: false}) => {
    //ensure picked date is valid
    if ( !inputs.resetSearch && !timeFunc.isValidDate(userEventFilters.startDate) ) return
    const startDate = userEventFilters.startDate
    prevSearchDate = startDate;

    //test search speed
    var t0 = performance.now() 

    //filter by date, which may have just been reset
    let date = (inputs.resetSearch) ? today() : startDate
    let events = rawEventData.filter(event => (date < event.date))

    //filter by what is in the search bar, unless we have just reset search bar
    if (userEventFilters.searchTerm && !inputs.resetSearch){

      const searchTerm = userEventFilters.searchTerm.toLowerCase()
      
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
    setEvents(events)
  }

  useEffect(() =>{
    performFilter()
  }, [rawEventData])

  return(
    <div className="card">
      <h1 style={{marginBottom: "1rem"}}> 
        {showingAllEvent ? "All " : (selectedSocs.length > 1) ? "My " : ""}
        Events 
        {events.searchTerm && `- "${events.searchTerm}"`}
      </h1>

      {/** Shortcut to Choose Societies */}
      <div><Link  className="button modernButton" to={"/societies"}> 
        Choose societies 
      </Link></div>      

      {/* swap between "My Events" and "All Events" */}
      {showingAllEvent
      ? <div><Link  className="button modernButton" to={"/my-events"}> 
          Show Events for my Chosen Societies 
        </Link></div>     
      : <div><Link  className="button modernButton" to={"/all-events"}> 
          Show Events for All Societies 
        </Link></div>     
      }

      {/** Filter by search term */}
      <div className="userEventFilters form" style={{display: "block"}}>
          <input placeholder="Search Events..." type="text" name="searchTerm" 
                 value={userEventFilters.searchTerm} 
                 onChange={handleFilterChange}>
          </input>
      </div>

      {/** Filter by date */}
      <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", height: "3rem", marginTop: "1rem"}}>
        <span style={{marginRight: "1rem", marginTop: "0rem"}}> Events from: </span>
        <DatePicker value={userEventFilters.startDate} onChange={handleDateChange}/>
      </div>

      {/** submit user filters */}
      <div>
        <button className="button buttonRound" type="submit" onClick={submitSearch} 
          style={{transform: "scale(0.8)"}}>
          <i className="fas fa-search"></i> Search
        </button>
          
        <button className="button buttonRound" name="clearSearch" onClick={handleFilterChange} 
                style={{transform: "scale(0.8)"}}>
          X Clear
        </button>
      </div>

      {(rawEventData & !rawEventData.err & rawEventData.length===0) ? <Loading /> : ""}

      <h2 style={{textAlign: "left", marginLeft: "1rem", fontSize: "1.4rem"}}> 
        Showing for 
        {(selectedSocs.length === 0 | showingAllEvent) 
          ? " ALL societies." 
          : " selected societies." }
      </h2>

      <div className="events">

      { rawEventData.err ? 
          "Error: Could not connect" :
        !events.length ? 
          <p style={{textAlign: "center"}}> No events found for after 
            {dateFormat(events.startDate, " dddd dS mmm yyyy")}
            {userEventFilters.searchTerm  ? ` for "${userEventFilters.searchTerm}"` : "" }
            {userEventFilters.searchTerm  ? ` for "${userEventFilters.searchTerm}"` : "" }
            {!selectedSocs.has("VIEW_ALL")? ` for selected societies ` : ""}
          </p>  
        :
        events.map((event, index, arr) => (              
          <div key={`event-div-${index}`}>
              
            {( !index || !timeFunc.datesAreOnSameDay( new Date(arr[index-1].date) , new Date(event.date) ) ) ?   
              <h2 className="dateHeader"> {dateFormat(event.date, "dddd dS mmmm")} </h2> 
            : ""}

            <Event event={event} key={event._id} />
              
          </div>)
        )
      }
      </div>


    </div>
  )
}   

export default Events
