import React, {useEffect} from 'react'
import {Link} from 'react-router-dom';
import {useLocaleObjectState} from '../functions/hooks';

import Society from './Society'
import Loading from './LoadingBar'
import ShowAllEventsSwitch from './ShowAllEventsSwitch'
//const socs = require('../societies.json')
const hour = 3600000

function Societies(props) {
  const [societies, setSocieties] = useLocaleObjectState("SocietiesInfo", []);
  
  useEffect(() => {
    if (societies.lastUpdate || new Date() - new Date(societies.lastUpdate) < 1000*hour ) return
    else fetchSocieties()
  }, [] );

  const fetchSocieties = async () => {
    const data      = await fetch(window.location.origin + "/api/societies");
    const societies = await data.json();
    societies.lastUpdate = new Date()
    setSocieties(societies)
  }

  return(
    <div className="card">
      <h1> Trinity Societies </h1>
      
      {/* Toggle between all societies and selected few societies */}
      <div>
        <ShowAllEventsSwitch />
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