import React, {useState, useEffect} from 'react'
import Book from './Book'
import Loading from './LoadingBar'
const config = require ('../config.json');

function Library(props) {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("");
  
  const updateSearch = (event) => {
    setFilter(event.target.value)
  }

  useEffect(() => {
    fetchEvents()
  }, [] );

  const fetchEvents = async () => {
    const data    = await fetch(window.location.origin + "/api/books");
    const books   = await data.json();
    setBooks(books)
  }

  return(
    <div className="card">
      <h1> Library Books </h1>
      <div class="form">
      <p style={{textAlign: "center"}}> 
        To loan a book simply email our librarian :
        <a href={"mailto:" + config.librarianEmail}> {config.librarianEmail} </a>
        <br/>
        More info about lending rules on the about page.
      </p>
      <input placeholder="Search..." value={filter} onChange={updateSearch}></input>
      </div>
      <br/>
      {(books.length===0)?<Loading />:""}
      {/* Scrap here */}
      <div className="events">
        {books.map(book =>
          (!filter | !!book.title.toLowerCase().match(filter.toLowerCase()) | !!book.author.toLowerCase().match(filter.toLowerCase())) 
          ? <Book book={book} key={book.title} />
          : console.log( book.title.toLowerCase().match(filter.toLowerCase()) )
        )}
      </div>
          
    </div>
  )
}   

export default Library