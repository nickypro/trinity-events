import React from 'react'
import timeFunc from '../../functions/timeFunctions'
import './Event.css'

const Event = (props) => (
  <a  className="event"
      href={props.event.url} 
      data-date={props.event.date} 
      data-title={props.event.title}
      data-location={props.event.location}>
    <div className="eventDate">
      <span>{timeFunc.toTime(props.event.date)} </span>
      <span>  {timeFunc.toWeekday(props.event.date)}</span>
    </div>
    <div className="eventData">
      <h2>  {props.event.title}</h2>
      <p>   {props.event.location}</p>
      <p>   {props.event.societyNames.toString()} </p>
    </div>
  </a>
)

export default Event