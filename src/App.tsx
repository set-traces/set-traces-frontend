import React, { useEffect, useState } from "react"
import Console from "./pages/Console"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import ProjectPanel from "./pages/ProjectPanel"
import Toolbar from './components/DevOpsToolbar'
import DevOps from "./pages/DevOps"
import { Project } from "./api/dataTypes"
import { fetchProjects } from "./api/endpoints"

function App() {
  return (
    <div style={{ fontFamily: "arial", height: "100vh" }}>
      <Toolbar />
      <Router>
        <Switch>
          <Route path={"/project/:projectId/:scriptId?"} component={ProjectPanel} />
          <Route path={"/devops"} component={DevOps} />
          <Route path={"/"} component={Console} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
