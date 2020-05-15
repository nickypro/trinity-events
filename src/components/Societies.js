import React, {useState, useEffect, useContext} from 'react'
import {SelectedSocsContext} from '../App'
import {Link} from 'react-router-dom';
import Switch from '@material-ui/core/Switch';

import Society from './Society'
import Loading from './LoadingBar'
//const socs = require('../societies.json')

function Societies(props) {
  const [societies, setSocieties] = useState([]);
  const [selectedSocs, setSelectedSocs] = useContext(SelectedSocsContext)
  const [shouldViewAllEvents, setViewAllEvents] = useState(selectedSocs.has("VIEW_ALL"))

  useEffect(() => {
    fetchSocieties()
  }, [] );

  const fetchSocieties = async () => {
    const data      = await fetch(window.location.origin + "/api/societies");
    const societies = await data.json();
    setSocieties(societies)
  }

  const toggleViewAllEvents = () => {
    let temp
    if (!selectedSocs) 
      temp = new Set()
    else temp = selectedSocs

    if ( selectedSocs.has("VIEW_ALL") ) 
      temp.delete("VIEW_ALL")
    else 
      temp.add("VIEW_ALL")

    setViewAllEvents(!shouldViewAllEvents)
    setSelectedSocs(temp)
  }

  return(
    <div className="card">
      <h1> Trinity Societies </h1>
      
      {/* Toggle between all societies and selected few societies */}
      <div>
      <label className="menuLabel" htmlFor="toggleViewAllEvents"> 
        <Switch
            checked={shouldViewAllEvents}
            onChange={toggleViewAllEvents}
            name="toggleViewAllEvents"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
        {shouldViewAllEvents? "View Events from all Trinity Societies" : "View Selected Society Events Only"}
      </label>
      </div>

      {/* Quick link to view events */}
      <div><Link  className="button modernButton" to={"/events"}> 
        View Events
      </Link></div>

      {/* Show Loading bar or Error Message if no data */}
      {societies.err ? <p>{societies.err}</p> : (societies.length===0)?<Loading />:""}

      {/* List all societies */}
      {societies.err ? "Error: Could not connect" :
       societies.map((society, index) => 
       <Society society={society} key={society.id} index={index} />
      )}
      
      {/* Another Quick link to view events */}
      <div><Link  className="button modernButton" to={"/events"}> 
        View Events
      </Link></div>

    </div>
  )
}   

export default Societies