/**
 * 项目的根组件
 */


import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom"


import Login from "./pages/login"
import Register from "./pages/register"
import Main from "./pages/main"

import "./assets/css/index.less"
function App() {
  return (
    <Router>
      <Switch> 
        <Route path="/login" component={ Login }/>
        <Route path="/register" component={ Register }/>
        <Route path="/" component={ Main }/>
      </Switch>
    </Router>
  );
}

export default App;
