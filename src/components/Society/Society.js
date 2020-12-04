import React, {useState, useContext} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Checkbox from '@material-ui/core/Checkbox';
import "./dist/Society.css"
import {SelectedSocsContext} from '../../App'
import {Link} from 'react-router-dom';


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
          disabled={(props.society.facebookHandle) ? false : true}
        />
        </div>
        
      </div>
    
      <div className="title">
        <h2 style={{marginTop: "0.2em"}}>
          {props.society.name}        
        </h2>
      </div>

      <button className="expansionButton expansionTextButton"
                onClick={() => changeExpansion(!expanded)}
                > 
        {expanded ? "Show Less" : "Show More"}
      </button>
    </div>

    <div id={props.society.name} 
      className="societyAbout"
      style={{display: (expanded)?"block":"none"}}>   
      
      <p style={{
        textAlign: "left",
        marginLeft: "3.8rem",
      }}>
        
        { props.society.email ? <a href={`mailto:${props.society.email}`}>
          <FontAwesomeIcon className="mediaLink" icon="envelope"/>
        </a> : ""}
        
        { props.society.facebook ? <a href={props.society.facebook}>
          <FontAwesomeIcon className="mediaLink" icon={["fab","facebook"]}/>
        </a> : ""}
        
        { props.society.instagram ? <a href={props.society.instagram}>
          <FontAwesomeIcon className="mediaLink" icon={["fab","instagram"]}/>
        </a> : ""}
        
        { props.society.twitter ? <a href={props.society.twitter}>
          <FontAwesomeIcon className="mediaLink" icon={["fab","twitter"]}/>
        </a> : ""}

        { props.society.twitter ? <a href={props.society.snapchat}>
          <FontAwesomeIcon className="mediaLink" icon={["fab","snapchat"]}/>
        </a> : ""}

        <Link to={`/society/${props.society.id}`}> EVENTS </Link>

      </p>
      <p className="societyAbout">
        {props.society.about}
      </p>
    </div>

  </div>
)}

export default Society