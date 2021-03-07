import React from 'react'

const WidgetsWrapper = ({children, title}) => (
    <div className="widget-component">
        <div className="widget-header">
          <a href="https://society.events">
            <h2> {title || "Society.Events"} </h2>
          </a>
        </div>
        <div className="widget-content">
            {children}
        </div>
    </div>
);

export default WidgetsWrapper