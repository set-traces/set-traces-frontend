import React from "react"
import { Role as RoleType, Script, ScriptLineRemark } from "../api/dataTypes"
import styled from "styled-components"
import { SCRIPT_LINE_TYPE_ACTION } from "../api/testData"
import { theme } from "../Theme"

type Props = {
  className?: any
  script: Script
}

const Wrapper = styled.div``

const BackgroundPaper = styled.div`
  background-color: #fff;
  box-shadow: 0px 0px 1px 1px rgba(214, 214, 214, 1);
  //padding: 0 10% 100px 10%;
  max-width: ${800 - 96 * 2}px;
  padding-left: 96px;
  padding-right: 96px;
  padding-top: 96px;

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

  return (
    <Wrapper className={className}>
      <BackgroundPaper>
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
        {script.lines.map((line, i) => (
          <Line key={i}>
            {line.type === SCRIPT_LINE_TYPE_ACTION ? (
              `[${line.text}]`
            ) : (
              <span>
                <Role color={rolesColors[line.role]}>{line.role}</Role>: {line.text}
              </span>
            )}
          </Line>
        ))}
      </BackgroundPaper>
    </Wrapper>
  )
}

export default ScriptView
