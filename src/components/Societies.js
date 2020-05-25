import React, {useEffect} from 'react'
import {Link} from 'react-router-dom';
import {useLocaleState, useLocaleObjectState} from '../functions/hooks';

import Society from './Society'
import Loading from './LoadingBar'
import ShowAllEventsSwitch from './ShowAllEventsSwitch'
//const socs = require('../societies.json')
const hour = 3600000

function Societies(props) {
  const [societies, setSocieties] = useLocaleObjectState("SocietiesInfo", []);
  const [lastUpdateTime, setLastUpdateTime] = useLocaleState("SocietiesInfoUpdate", "");
  
  useEffect(() => {
    if (societies.length > 2 && new Date() - new Date(lastUpdateTime) < 30*24*hour ) return
    else fetchSocieties()
  }, [] );

  const fetchSocieties = async () => {
    console.log("Fetching Societies from server")
    const data      = await fetch(window.location.origin + "/api/societies");
    const societies = await data.json();
    setLastUpdateTime(new Date().toLocaleDateString())
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