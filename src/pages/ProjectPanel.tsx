import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Project, Script } from "../api/dataTypes"
import { fetchProjects } from "../api/endpoints"
import { RouteComponentProps } from "react-router-dom"
import ScriptList from "../components/ScriptList"
import ScriptView from "../components/ScriptView"

type RouterParams = {
  projectId: string
  scriptId: string | undefined
}
interface Props extends RouteComponentProps<RouterParams> {}

const Wrapper = styled.div`
  display: grid;
  background-color: #f8f9fa;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: auto;
  grid-template-areas: "main rightSidebar";
`

const StyledScriptList = styled(ScriptList)`
  position: fixed;
`

const StyledScriptView = styled(ScriptView)`
  margin: 0 5%;
`

const ProjectPanel: React.FC<Props> = ({ history, match }) => {
  const [project, setProject] = useState<Project | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const [viewScript, setViewScript] = useState<Script | undefined>(undefined)

  const projectId: string = match.params.projectId
  const viewScriptId: string | undefined = match.params.scriptId

  useEffect(() => {
    fetchProjects()
      .then((projects) => {
        const newProject: Project | undefined = projects.find((project) => project.id === projectId)
        if (newProject) {
          setProject(newProject)
        } else {
          setError("No projects found for the given id")
        }
      })
      .catch((err) => setError(err.toString()))
  }, [match.params.projectId])

  useEffect(() => {
    if (project && viewScriptId) {
      const _viewScript = project.scripts.find((script) => script.id === viewScriptId)
      if (_viewScript) {
        setViewScript(_viewScript)
      } else {
        setError("Could not find script in the current project with id: " + viewScriptId)
      }
    }
  }, [match.params.scriptId, project, viewScriptId])

  return (
    <Wrapper>
      <div style={{ gridArea: "main" }}>
        <h1>Project panel</h1>
        {error}
        {viewScript && <StyledScriptView script={viewScript} />}
      </div>
      <div style={{ gridArea: "rightSidebar" }}>
        {project && (
          <StyledScriptList
            scripts={project.scripts}
            onViewClick={(script: Script) => history.push(`/project/${projectId}/${script.id}`)}
          />
        )}
      </div>
    </Wrapper>
  )
}

export default ProjectPanel
