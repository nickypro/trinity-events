import React, {useState, useEffect, useContext} from 'react'
import Event from './Event'
import LoadingBar from './LoadingBar'

import getParameterByName from '../functions/query'
import timeFunc from '../functions/timeFunctions'
import fetchEvents from './Events/fetchEvents'
import Loading from './LoadingBar'
import WidgetsWrapper from './WidgetsWrapper'

const dateFormat = require('dateformat');
const today = timeFunc.startOfToday

const EventsWidget = (props) => {
  let soc = Number( getParameterByName("soc") )
  let socs = [soc]

  const [events, setEvents] = useState(0); // unfiltered events 
  const [oldEvents, setOldEvents] = useState([]) // old Events

  const fetchEventsAndUpdate = async (inputs = {}) => {
    const date =  dateFormat(today(), "yyyy-mm-dd");
    const newEvents = await fetchEvents(date, socs)
    setEvents(newEvents)
    const prevEvents = await fetchEvents(date, socs, {before: 20})
    setOldEvents(prevEvents)
  }

  useEffect(() =>{
    fetchEventsAndUpdate()
  }, [])

  return (
      <WidgetsWrapper >

        <div className="events">

        {!socs && "Searching All Societies"}

        { events.err ? 
            "Error: Could not connect" :
            (events === 0) ?
            <LoadingBar /> :
            !events.length ? 
            <p style={{textAlign: "center"}}> No events found for after 
                {dateFormat(events.startDate, " dddd dS mmm yyyy")}
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

        {oldEvents && oldEvents.length != 0 && 
        <div>
          <h2 style={{textAlign: "center"}}>Past Events</h2>
          {
          oldEvents.reverse().map((event, index, arr) => (              
            <div key={`event-div-${index}`}>
                
                {( !index || !timeFunc.datesAreOnSameDay( new Date(arr[index-1].date) , new Date(event.date) ) ) ?   
                <h2 className="dateHeader grayed"> {dateFormat(event.date, "dddd dS mmmm yyyy")} </h2> 
                : ""}

                <Event event={event} key={event._id} className="grayed"/>
                
            </div>)
          )
          }
        </div>
        }

        </div>

    </WidgetsWrapper>
    )
}

export default EventsWidget