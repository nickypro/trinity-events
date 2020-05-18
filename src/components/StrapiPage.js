import React, {useState, useEffect} from 'react'
import Loading from './LoadingBar'
import marked from 'marked'

const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
  return `<a target="_blank" href="${href}">${text}`+"</a>";
}
renderer.gfm = true;

const config = require('../config.json');

const postsUrl = `${config.strapiUrl}/pages`;

function Page(props) {
  const [pages, setPages] = useState([]);
  
  useEffect(() => {
    fetchEvents()
  }, [] );
  
  const fetchEvents = async () => {
    const data = await fetch(postsUrl);
    const pages = await data.json();
    console.log(pages)
    setPages(pages)
  }
  
  return(
  <div className="card">
    <h1> {props.match.params.slug} </h1>
    {(pages.length===0)?<Loading />:""}
    <div className="content"
    dangerouslySetInnerHTML=
    {{__html: pages.error ? "Error Loading Page" : pages
      .filter(x => x.title === props.match.params.slug)
      .map(x => marked(x.pageText, {renderer: renderer }) )
    }}></div>
  </div>
  )
}

export default Page