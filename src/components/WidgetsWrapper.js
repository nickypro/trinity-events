import React from 'react'

const WidgetsWrapper = ({children, title}) => (
    <div className="widgets-component">
        <div className="widgets-header">
          <a href="https://society.events">
            <h2> {title || "Society.Events"} </h2>
          </a>
        </div>
        <div className="widgets-content">
            {children}
        </div>
    </div>
);

export default WidgetsWrapper