import React from "react"
import { Role as RoleType, Script, ScriptLineType } from "../api/dataTypes"
import styled from "styled-components"
import { theme } from "../Theme"

type Props = {
  className?: any
  script: Script
}

const Wrapper = styled.div`
  //margin-bottom: 100px;
`

const BackgroundPaper = styled.div`
  background-color: #fff;
  box-shadow: 0px 0px 1px 1px rgba(214, 214, 214, 1);
  //padding: 0 10% 100px 10%;
  width: ${800 - 96 * 2}px;
  min-width: 400px;
  padding: 96px;

  display: flex;
  flex-direction: column;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  //font-size: 11px;
`

const Title = styled.h1`
  color: ${(props) => props.theme.colors.undertone};
  margin-top: 0;
  margin-bottom: 32px;
`

const Description = styled.span`
  margin-bottom: 32px;
`

const RolesMetaContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-bottom: 24px;
  margin-bottom: 48px;
  border-bottom: 1px solid ${(props) => props.theme.colors.undertone};
`

const Role = styled.span<{ color: string }>`
  //border-bottom: 2px solid ${(props) => props.color};
  background-color: ${(props) => props.color};
  padding: 2px;
  border-radius: 3px;
`

const RolesMetaRole = styled(Role)`
  margin: 5px;
`

const Line = styled.p`
  margin: 0;
  padding: 3px 0;
`

const Cursor = styled.span`
  border-left: 2px solid red;
  position: marker;
`

const COLOR_ALPHA = "aa"
const ROLES_COLORS = [
  theme.colors.undertone + COLOR_ALPHA,
  theme.colors.negative + COLOR_ALPHA,
  theme.colors.positive + COLOR_ALPHA,
  theme.colors.negativeIsh + COLOR_ALPHA,
  theme.colors.highlight + COLOR_ALPHA,
]

const ScriptView: React.FC<Props> = ({ className, script }) => {
  const rolesColors: Record<RoleType, string> = {}

  script.rolesMeta.forEach(
    (roleMeta, i) => (rolesColors[roleMeta.role] = ROLES_COLORS[i % ROLES_COLORS.length]),
  )

  const linesElements = script.lines.map((line, i) => {
    switch (line.type) {
      case ScriptLineType.ACTION:
        return <p>[${line.text}]</p>
      case ScriptLineType.REMARK:
        return (
          <span>
            <Role color={rolesColors[line.role]}>{line.role}</Role>: {line.text}
          </span>
        )
      case ScriptLineType.COMMENT:
        return <span>{line.text}</span>
    }
  })

  const contentElem = (
    <span>
      <Title>{script.name}</Title>
      <RolesMetaRole color={"#00000000"}>
        <strong>Context:</strong>
      </RolesMetaRole>
      <Description>{script.description}</Description>
      <RolesMetaContainer>
        <RolesMetaRole color={"#00000000"}>
          <strong>Roles: </strong>
        </RolesMetaRole>
        {script.rolesMeta.map((roleMeta, i) => (
          <RolesMetaRole key={i} color={rolesColors[roleMeta.role]}>
            {roleMeta.role}
          </RolesMetaRole>
        ))}
      </RolesMetaContainer>
      {linesElements}
    </span>
  )

  return (
    <Wrapper className={className}>
      <BackgroundPaper>{contentElem}</BackgroundPaper>
    </Wrapper>
  )
}

export default ScriptView
