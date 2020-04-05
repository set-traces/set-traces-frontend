import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Project, Script } from "../api/dataTypes"
import { fetchProjects } from "../api/endpoints"
import { RouteComponentProps } from "react-router-dom"
import ScriptList from "../components/ScriptList"
import ScriptView from "../components/ScriptView"
import ScriptLinesEditor from "../components/ScriptLinesEditor"
import ScriptEditor from "../components/ScriptEditor"

type RouterParams = {
  projectId: string
  scriptId: string | undefined
}
interface Props extends RouteComponentProps<RouterParams> {}

const Wrapper = styled.div`
  display: grid;
  background-color: #f8f9fa;
  padding: 0 10px;
  max-height: 100vh;
  box-sizing: border-box;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: 64px 1fr;
  grid-template-areas:
    "header header"
    "main rightSidebar  ";

  //overflow: hidden;
`

const StyledScriptList = styled(ScriptList)`
  //height: 30%;
  overflow-y: scroll;
  grid-area: rightSidebar;
  ${(props) => props.theme.scrollbarStyling}
`

const ScriptViewWrapper = styled.div`
  padding-top: 1px;
  grid-area: main;
  justify-self: start;
  width: 100%;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  //max-height: 100%;

  ${(props) => props.theme.scrollbarStyling}
`

const StyledScriptEditor = styled(ScriptEditor)`
  //width: 100%;
  box-sizing: border-box;
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
      <div style={{ gridArea: "header" }}>
        <h1>{project ? project.name : "..."}</h1>
        {error}
      </div>
      {viewScript && (
        <ScriptViewWrapper>
          <StyledScriptEditor script={viewScript} key={viewScript.id} />
        </ScriptViewWrapper>
      )}
      {project && (
        <StyledScriptList
          scripts={project.scripts}
          onClick={(script: Script) => history.push(`/project/${projectId}/${script.id}`)}
        />
      )}
    </Wrapper>
  )
}

export default ProjectPanel
