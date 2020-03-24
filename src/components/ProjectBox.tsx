import React from "react";
import styled from "styled-components";
import {Project} from "../api/dataTypes";

type Props = {
  className?: string
  project: Project
  onClick?: (project: Project) => void
}

const Wrapper = styled.div`
  box-shadow: 2px 2px 5px 0px rgba(0,0,0,0.75);
  padding: 30px;
  background-color: #ddd;
  // border:1px solid ${props => props.theme.colors.dark};
  //border-radius:4px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #aaa;
  }
`

const Title = styled.h3`
  flex-grow: 1;
  margin: 0; 
  color: ${props => props.theme.colors.highlight};
`

const Description = styled.div`
  flex-grow: 2;
  color: ${props => props.theme.colors.dark};
`


const ProjectBox: React.FC<Props> = ({className, project, onClick}) =>  {

  return (
    <Wrapper className={className} onClick={() => onClick && onClick(project)}>
      <Title>
        {project.title}
      </Title>
      <hr/>
      <Description>
        {project.description}
      </Description>
    </Wrapper>
  )
}

export default ProjectBox