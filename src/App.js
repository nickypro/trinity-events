import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ReactGA from 'react-ga';
import './css/App.css';
import {useLocaleSetsState} from './functions/hooks'

import Menu from './components/Menu/Menu';
import BigLogo from './components/BigLogo'
import StrapiPage from './components/StrapiPage'
import Events from './components/Events'
import AllEvents from './components/AllEvents'
import SignUp from './components/SignUp'
import Library from './components/Library';
import Societies from './components/Societies'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fab, fas)

export const SelectedSocsContext = React.createContext();

const config = require('./config.json');

//google analytics
function initializeReactGA(page) {
  ReactGA.initialize(config.GAnalytics);
  ReactGA.pageview(page);
}

const App = (props) => {

  const [selectedSocs, setSelectedSocs] = useLocaleSetsState("selectedSocs")
  const [width, setWidth] = useState(window.innerWidth)
  const [menuHidden, setMenuHidden] = useState(false)
  const [auth, setAuth] = useState({
    user: {},
    error: null,
    authenticated: false,
  })

  useEffect(() => {
    fetch("/auth/login/success", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })
      .then(response => {
        if (response.status === 200) return response.json();
        throw new Error("failed to authenticate user");
      })
      .then(responseJson => {
        setAuth({
          authenticated: true,
          user: responseJson.user,
        });
      })
      .catch(error => {
        setAuth({
          authenticated: false,
          error: "Failed to authenticate user"
        });
      });
  }, [])

  const toggleMenu = () => setMenuHidden(!menuHidden)

  useEffect(() => {
    //change width on resize with event listener
    const resizeListener = () => setWidth(window.innerWidth)
    window.addEventListener('resize', resizeListener);

    //remove event listener on component unmount
    return () => window.removeEventListener('resize', resizeListener);
  },[])

  const isMenuShown = () => {
    return( width <= 900 & !menuHidden )
  }

  return (
  <SelectedSocsContext.Provider value={[selectedSocs, setSelectedSocs]}>
    <Router>
    {initializeReactGA(window.location.pathname)}
    <div className="App welcomeBox">
      
      <Menu menuItems={config.menuItems} 
            width={width}
            hidden={menuHidden}
            toggleMenu={toggleMenu} />
      
      <div  className="pageFocus" 
            style={isMenuShown()? {transform: "translateX(100%)"} : {}}>
        <Switch>
          <Route path="/society/:id" render={(props) => <Events socs={[Number(props.match.params.id)]} />} />
          <Route path="/events" component={Events} />
          <Route path="/my-events" component={Events} />
          <Route path="/all-events" component={AllEvents} />
          <Route path="/societies" component={Societies} />
          <Route path="/library" component={Library} />
          <Route path="/signup" component={SignUp} />
          <Route path="/:slug" component={StrapiPage} />
          <Route path="/" component={Events} />
        </Switch>    
      </div>

    </div>
    </Router>
  </SelectedSocsContext.Provider>
  )
}


export default App;
