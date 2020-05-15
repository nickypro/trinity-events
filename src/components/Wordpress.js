import React, {useState, useEffect} from 'react'
import Loading from './LoadingBar'
const config = require('../config.json');

const postsUrl = `${config.wpUrl}wp-json/wp/v2/posts`;

function Wordpress(props) {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetchEvents()
  }, [] );
  
  const fetchEvents = async () => {
    const data = await fetch(postsUrl);
    const posts = await data.json();
    setPosts(posts)
  }
  
  return(
  <div className="card">
    <h1> {props.match.params.slug} </h1>
    {(posts.length===0)?<Loading />:""}
    <div className="content"
    dangerouslySetInnerHTML=
    {{__html: posts
      .filter(x => {
        return x.slug === props.match.params.slug
      })
      .map(x => x.content.rendered)
    }}></div>
  </div>
  )
}

export default Wordpress