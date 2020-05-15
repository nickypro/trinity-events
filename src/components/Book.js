import React from 'react'

const Book = (props) => (
  <a  className="event"
      href={props.book.url}
      data-title={props.book.title}
      data-author={props.book.author}
      data-available={props.book.available}>
    <div className="eventDate">
      <svg height="50" width="50" style={{opacity: 0.5}}>
        <circle cx="25" cy="25" r="20" fill={props.book.available?"green":"red"} />
      </svg>
    </div>
    <div className="eventData">
      <h2>  {props.book.title}</h2>
      <p>   {props.book.author}</p>
    </div>
  </a>
)

export default Book