import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';


import Home from './component/Home';
import About from './component/About';


function App() {
  return (
  	<Router>
	    <Switch>
			<Route exact path = '/'>
				<Home />
			</Route>
			<Route path = '/about'>
				<About />
			</Route>
	    </Switch>
    </Router>
  );
}

export default App;
