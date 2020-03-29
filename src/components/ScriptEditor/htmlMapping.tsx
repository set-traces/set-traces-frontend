import { SCRIPT_LINE_TYPE_ACTION } from "../../api/testData"
import React, { ReactElement } from "react"
import styled, { AnyStyledComponent } from "styled-components"
import { theme } from "../../Theme"
import { Role as RoleType, Script } from "../../api/dataTypes"

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
const Role = styled.span`
  //border-bottom: 2px solid ${(props) => props.color};
  background-color: ${(props) => props.color};
  padding: 2px;
  border-radius: 3px;
`

// const QRole = (children: string) => `
//   //border-bottom: 2px solid ${(props) => props.color};
//   background-color: ${(props) => props.color};
//   padding: 2px;
//   border-radius: 3px;
// `
const Test = styled.span`
  //
  background-color: ${(props) => props.theme.undertone};
  //
`

const RolesMetaRole = styled(Role)`
  margin: 5px;
`

const Line = styled.p`
  margin: 0;
  padding: 3px 0;
`

const SCstr = (scElem: AnyStyledComponent, props: any = {}): ((elemType: string) => string) => {
  const propsWithGlobal = { ...props, theme }
  const styleRules = (scElem as any).componentStyle.rules
  const processedRules = styleRules.map((rule: any) =>
    typeof rule === "function" ? rule({ theme }) : rule,
  )
  // console.log(styleRules)
  // console.log(processedRules)
  const style = (processedRules as string[]).join("")
  const elemType = scElem.target
  return (content: string) => {
    const htmlString = `<${elemType} style='${style}'>${content}</${elemType}>`
    // console.log(htmlString)
    return htmlString
  }
}

const htmlMapping = (script: Script, rolesColors: Record<RoleType, string>): ReactElement => {
  const linesElements = script.lines.map((line, i) => (
    <Line key={i}>
      {line.type === SCRIPT_LINE_TYPE_ACTION ? (
        <p>[${line.text}]</p>
      ) : (
        <span>
          <Role color={rolesColors[line.role]}>{line.role}</Role>: {line.text}
        </span>
      )}
    </Line>
  ))

  const contentElems = (
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
  return contentElems
}
