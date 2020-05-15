import React from 'react';
import {Link} from 'react-router-dom';
import toKebabCase from '../../functions/toKebabCase'
import "./Menu.css"

import SocialMediaLinks from '../SocialMediaLinks'

const config  = require('../../config.json');

const Menu = (props) => (
  <nav  className="mainMenu"  
        onClick={props.toggleMenu} 
        style={props.hidden?{overflow: "hidden"}:{}}>
  

  { (props.width <= 900)?
  <div className="topbar">
    <button onClick={props.toggleMenu} className="topbarButton">
      <i className="burger fas fa-bars"></i>
    </button>
    <button onClick={props.toggleMenu} className="topbarButton">
      <h1 id="topbarTitle">{config.shortTitle}</h1>
    </button>
  </div>:""}

  <Link to="/"> <h1 className="menuHead">{config.longTitle}</h1> </Link>

  {props.menuItems.map(menuItem =>
    <Link  
      className="mainButton fadeIn uphover "
      key={toKebabCase(menuItem)} 
      to={"/"+toKebabCase(menuItem)}> 
        {menuItem} 
    </Link>
  )}
	
  <SocialMediaLinks />
  </nav>
)


export default Menu;