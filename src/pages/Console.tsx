import React, { useEffect, useState } from "react"
import styled from "styled-components"
import ProjectBox from "../components/ProjectBox"
import { RouteComponentProps } from "react-router-dom"
import { Project } from "../api/dataTypes"
import { fetchProjects } from "../api/endpoints"

interface Props extends RouteComponentProps {}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const PageRow = styled.div`
  flex: 1;
`

const ProjectsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const StyledProjectBox = styled(ProjectBox)`
  margin: 30px 30px;
`

const ConsoleTitle = styled.div`
  color: ${(props) => props.theme.colors.dark};
`

const Console: React.FC<Props> = ({ history }) => {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetchProjects().then(setProjects)
  }, [])

  return (
    <Wrapper>
      Console
      <PageRow>Something</PageRow>
      <PageRow>
        Projects
        <ProjectsContainer>
          {projects.map((project) => (
            <StyledProjectBox
              key={project.id}
              project={project}
              onClick={(project) => history.push("/project/" + project.id)}
            />
          ))}
        </ProjectsContainer>
      </PageRow>
      <PageRow>Something</PageRow>
    </Wrapper>
  )
}

export default Console
