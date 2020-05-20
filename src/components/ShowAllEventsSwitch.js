import React, {useState, useContext} from 'react'
import {SelectedSocsContext} from '../App'
import Switch from '@material-ui/core/Switch'

const ShowAllEventsSwitch = (props) => {
  const [selectedSocs, setSelectedSocs] = useContext(SelectedSocsContext)
  const [shouldViewAllEvents, setViewAllEvents] = useState(selectedSocs.has("VIEW_ALL"))

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

  return (
  <label className="menuLabel" htmlFor="toggleViewAllEvents"> 
    {"Ignore Selection : "}
    <Switch
        checked={shouldViewAllEvents}
        onChange={toggleViewAllEvents}
        name="toggleViewAllEvents"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
    />
    {shouldViewAllEvents? "(View from all societies)" : "(View from selected only)"}
  </label>)
}

export default ShowAllEventsSwitch;