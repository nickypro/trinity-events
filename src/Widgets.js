import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import EventsWidget from './components/EventsWidget';
import './css/App.css'

const Widgets = (props) => {
  return (
    <Router>
    <div className="widget">
        <Switch>
          <Route path="/widgets/events" component={EventsWidget} />
          <Route path="/" render={() => <p>Widget does not exist</p>} />
        </Switch>    
    </div>
    </Router>
  )
}

export default Widgets