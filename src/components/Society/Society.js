import React, {useState, useContext} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Checkbox from '@material-ui/core/Checkbox';
import "./Society.css"
import {SelectedSocsContext} from '../../App'


const Society = (props) => {
  const [expanded, changeExpansion] = useState(false)
  const [selectedSocs, setSelectedSocs] = useContext(SelectedSocsContext)
  const [selected, setSelected] = useState(selectedSocs ? selectedSocs.has(props.society.id) : false )

  const toggleSelection = () => {
    let temp
    if (!selectedSocs) 
      temp = new Set()
    else temp = selectedSocs

    if ( selectedSocs.has(props.society.id) ) 
      temp.delete(props.society.id)
    else 
      temp.add(props.society.id)

    setSelected(!selected)
    setSelectedSocs(temp)
  }

  return (
  <div  data-id={props.society.id}
        data-name={props.society.name} >
    
    <div className="societyMain">

      <div className="interaction" style={{display: "flex", flexDirection: "row"}}> 
          
          <button className="expansionButton"
                  style={{transform: ((expanded) ? "rotate(180deg)" : "") + " scale(1.2)",}}
                  onClick={() => changeExpansion(!expanded)}
                  > 
            <FontAwesomeIcon icon="angle-down"/>
          </button>

          <div>
          <Checkbox
            checked={ selected }
            style={{padding: "0px"}}
            onChange={ toggleSelection}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
          </div>
          
      </div>
      
      <div className="title">
      <h2 style={{marginTop: "0.2em"}}>
          
        {props.society.name}

        <span>
          
          {'\t'}
          
          { props.society.email ? <a href={props.society.email}>
            <FontAwesomeIcon className="mediaLink" icon="envelope"/>
          </a> : ""}
          
          {'\t'}

          { props.society.facebook ? <a href={props.society.facebook}>
            <FontAwesomeIcon className="mediaLink" icon={["fab","facebook"]}/>
          </a> : ""}
          
          {'\t'}

          { props.society.instagram ? <a href={props.society.instagram}>
            <FontAwesomeIcon className="mediaLink" icon={["fab","instagram"]}/>
          </a> : ""}
          
          {'\t'}

          { props.society.twitter ? <a href={props.society.twitter}>
            <FontAwesomeIcon className="mediaLink" icon={["fab","twitter"]}/>
          </a> : ""}

          {'\t'}

          { props.society.twitter ? <a href={props.society.snapchat}>
            <FontAwesomeIcon className="mediaLink" icon={["fab","snapchat"]}/>
          </a> : ""}


        </span>
        
        </h2>
        </div>
      </div>

      <p id={props.society.name} 
        className="societyAbout"
        style={{display: (expanded)?"block":"none"}}>   
        {props.society.about}
      </p>

  </div>
)}

export default Society