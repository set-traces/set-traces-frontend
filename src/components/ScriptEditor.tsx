import React, { ElementRef, ReactElement, useEffect, useRef, useState } from "react"
import { Role as RoleType, Script } from "../api/dataTypes"
import styled, { AnyStyledComponent, StyledComponent, StyledComponentBase } from "styled-components"
import { SCRIPT_LINE_TYPE_ACTION } from "../api/testData"
import { theme } from "../Theme"

import ReactQuill from "react-quill"
import * as Quill from "quill"
import "react-quill/dist/quill.bubble.css"
// @ts-ignore
import { UnprivilegedEditor } from "react-quill"

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
  //min-width: 400px;
  padding: 96px;

  //display: flex;
  //flex-direction: column;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  //font-size: 14px;
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

const COLOR_ALPHA = "aa"
const ROLES_COLORS = [
  theme.colors.undertone + COLOR_ALPHA,
  theme.colors.negative + COLOR_ALPHA,
  theme.colors.positive + COLOR_ALPHA,
  theme.colors.negativeIsh + COLOR_ALPHA,
  theme.colors.highlight + COLOR_ALPHA,
]

const ScriptEditor: React.FC<Props> = (props) => {
  const { className, script: initialScript } = props
  const [script, setScript] = useState<Script>(initialScript)
  // console.log(SCstr(Title)("PPPRRRRRA"))
  const [strContent, setStrContent] = useState<string>("")

  const contentRoot = useRef<any>()

  useEffect(() => {
    if (contentRoot.current) {
      console.dir(contentRoot.current)
      setStrContent(contentRoot.current.outerHTML)
    }
  }, [contentRoot.current])

  const rolesColors: Record<RoleType, string> = {}

  script.rolesMeta.forEach(
    (roleMeta, i) => (rolesColors[roleMeta.role] = ROLES_COLORS[i % ROLES_COLORS.length]),
  )

  const handleQuillChange = (
    content: string,
    delta: Quill.Delta,
    source: Quill.Sources,
    editor: UnprivilegedEditor,
  ) => {
    console.log(delta)
    // console.log(content)
    console.log("selection", editor.getSelection())
  }

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
    <span ref={contentRoot} hidden>
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
      {contentElems}
      <BackgroundPaper>
        <ReactQuill
          value={strContent}
          onChange={handleQuillChange}
          modules={{
            toolbar: [
              // [{ header: [1, 2, false] }],
              ["bold", "italic", "underline", "strike"],
              ["link"],
              ["clean"],
            ],
          }}
          formats={["header", "bold", "italic", "underline", "link", "strike", "clean"]}
          theme={"bubble"}
          style={{ borderWidth: 0 }}
        />
      </BackgroundPaper>
    </Wrapper>
  )
}

export default ScriptEditor
