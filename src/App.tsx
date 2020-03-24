import React, { useEffect, useState } from "react"
import Console from "./pages/Console"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import ProjectPanel from "./pages/ProjectPanel"
import { Project } from "./api/dataTypes"
import { fetchProjects } from "./api/endpoints"

function App() {
  return (
    <Router>
      <Switch>
        <Route path={"/project/:projectId/:scriptId?"} component={ProjectPanel} />
        <Route path={"/"} component={Console} />
      </Switch>
    </Router>
  )
}

export default App
