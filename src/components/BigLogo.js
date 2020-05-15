import React from 'react'
import logo from '../logo.png'

const config = require('../config.json');

const BigLogo = () => (
  <div style={{maxHeight: "90vh"}}>
    <img className="mainLogo" src={logo} alt="Trinity Events"/>
    <footer className="bottomText">
      <p> &copy; {new Date().getUTCFullYear()} {config.longTitle} </p>
      <p> Site designed by {" "}
        <a href="http://nicky.pro" style={{textDecoration: "underline"}}>
          Nicky Pochinkov
        </a>
      </p>
    </footer>
  </div>
)

export default BigLogo
