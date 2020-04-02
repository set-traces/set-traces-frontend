import React, { useEffect, useState } from "react"
import styled, {keyframes} from "styled-components"
import { Project, Script } from "../api/dataTypes"
import { fetchProjects, fetchProjectById } from "../api/endpoints"
import { RouteComponentProps, Route, Redirect } from "react-router-dom"
import ScriptList from "../components/ScriptList"
import ScriptView from "../components/ScriptView"
import { GreenButton } from "./../components/utils/ElementButton"
import NewSketch from "../components/NewSketch"
import { createScript } from "./../api/data"

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

  display: flex;
  flex-direction: row;
  justify-content: center;
  overflow-y: scroll;
  //max-height: 100%;

  ${(props) => props.theme.scrollbarStyling}
`
const StyledScriptView = styled(ScriptView)``

const HeaderWrapper = styled.div`
  position: relative;
  width: 100%;
`

const NewSketchButtonWrapper = styled.div`
  position: relative;
  width: 100%;
`

const NewSketchButton = styled(GreenButton)`
  position: absolute;
  top: 40%;
  right: 1em;
  transform: translate(0, -50%);
  box-sizing: boder-box;
  width: fit-content;
`

const Loading = () => {
  const rotate360 = keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
`

  const LoadingWrapper = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  `
  const LoadingAnimation = styled.div`
    animation: ${rotate360} 1s linear infinite;
    transform: translateZ(0);
    border-top: 13px solid ${(props: any) => props.theme.colors.positive};
    border-right: 13px solid ${(props: any) => props.theme.colors.negative};
    border-bottom: 13px solid ${(props: any) => props.theme.colors.highlight};
    border-left: 13px solid ${(props: any) => props.theme.colors.negativeIsh};
    background: transparent;
    width: 85px;
    height: 85px;
    border-radius: 50%;
  `

  return (
    <div style={{ padding: "2em" }}>
      <LoadingWrapper>
        <LoadingAnimation></LoadingAnimation>
      </LoadingWrapper>
    </div>
  )
}

const ProjectPanel: React.FC<Props> = ({ history, match }) => {
  const [project, setProject] = useState<Project | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const [viewScript, setViewScript] = useState<Script | undefined>(undefined)

  const [loading, setLoading] = useState<boolean>(false)
  const [redirectScript, setRedirectScript] = useState<string | null>(null)

  const projectId: string = match.params.projectId
  const viewScriptId: string | undefined = match.params.scriptId


  const getProject = () => {
    console.log('called')
    return fetchProjectById(projectId).then((newProject: Project) => {
      if (newProject) {
        setLoading(false)
        setProject(newProject)
      } else {
        setError("No projects found for the given id")
      }
    })
    .catch((err) => setError(err.toString()))
  }

  useEffect(() => {
    // fetchProjects()
    //   .then((projects) => {
    //     const newProject: Project | undefined = projects.find((project) => project.id === projectId)
    getProject()
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

  const newSketch = () => {
    setLoading(true)
    createScript(projectId, "Untitled", "", project!!.scriptTypes[0].id).then((r) => { // should send with defualt script type
      getProject().then(() => {
        history.push(`/project/${projectId}/${r.data.id}`)
      })
    })
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <Wrapper>
        <div style={{ gridArea: "header" }}>
          <div style={{ display: "flex" }}>
            <HeaderWrapper>
              <h1>{project ? project.name : "..."}</h1>
            </HeaderWrapper>
            <NewSketchButtonWrapper>
              <NewSketchButton onClick={newSketch}>Ny sketch</NewSketchButton>
            </NewSketchButtonWrapper>
          </div>
          {error}
        </div>
        {viewScript && (
          <ScriptViewWrapper>
            <StyledScriptView script={viewScript} />
          </ScriptViewWrapper>
        )}
        {project && (
          <StyledScriptList
            scripts={project.scripts}
            onClick={(script: Script) => history.push(`/project/${projectId}/${script.id}`)}
          />
        )}
      </Wrapper>
    </div>
  )
}

export default ProjectPanel
