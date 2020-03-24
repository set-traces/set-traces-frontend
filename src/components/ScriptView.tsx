import React from "react"
import { Script, ScriptLineRemark } from "../api/dataTypes"
import styled from "styled-components"
import { SCRIPT_LINE_TYPE_ACTION } from "../api/testData"

type Props = {
  className?: any
  script: Script
}

const Wrapper = styled.div`
  box-shadow: 0px 0px 1px 1px rgba(214, 214, 214, 1);
  padding: 0 10% 100px 10%;
  background-color: #fff;

  display: flex;
  flex-direction: column;
  font-family: "Arial";
`

const Title = styled.h1`
  margin-top: 80px;
`

const Description = styled.h4``

const RolesContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
`

const Role = styled.div`
  background-color: ${(props) => props.theme.colors.highlight};
  border-radius: 10px;
  padding: 5px;
  margin: 5px;
`

const Line = styled.p`
  margin: 0;
  padding: 3px 0;
`

const ScriptView: React.FC<Props> = ({ className, script }) => {
  return (
    <Wrapper className={className}>
      <Title>{script.name}</Title>
      <Description>{script.description}</Description>
      <RolesContainer>
        {script.rolesMeta.map((roleMeta, i) => (
          <Role key={i}>{roleMeta.role}</Role>
        ))}
      </RolesContainer>
      {script.lines.map((line, i) => (
        <Line key={i}>
          {line.type === SCRIPT_LINE_TYPE_ACTION ? (
            `[${line.text}]`
          ) : (
            <span>
              <strong>{line.role}</strong>: {line.text}
            </span>
          )}
        </Line>
      ))}
    </Wrapper>
  )
}

export default ScriptView
