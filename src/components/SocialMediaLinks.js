import React from 'react';
const config = require('../config.json')

function SocialMediaLinks() {
  return(
  <div className="mainSocialMedia fadeIn">
      <a href={config.facebook}> <span className="zoom fa-stack fa-lg socialMediaIcon">
        <i className="far fa-circle fa-stack-2x"></i>
        <i className="fab fa-facebook-f fa-stack-1x"></i>
      </span></a>
      <a href={config.instagram}> <span className="zoom fa-stack fa-lg socialMediaIcon">
        <i className="far fa-circle fa-stack-2x"></i>
        <i className="fab fa-instagram fa-stack-1x"></i>
      </span></a>
      <a href={"mailto:"+config.email}> <span className="zoom fa-stack fa-lg socialMediaIcon">
        <i className="far fa-circle fa-stack-2x"></i>
        <i className="fas fa-envelope fa-stack-1x"></i>
      </span> </a>
  </div>
  )
}

export default SocialMediaLinks;