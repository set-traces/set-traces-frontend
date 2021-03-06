import React, { useEffect, useState } from "react"
import { Role as RoleType, Script, ScriptLineRemark } from "../api/dataTypes"
import styled from "styled-components"
import { SCRIPT_LINE_TYPE_ACTION } from "../api/testData"
import { theme } from "../Theme"
import { useWindowEvent } from "../hooks/windowCallbacks"
import { useInterval } from "../hooks/timing"

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

type CursorPos = {
  lineIndex: number
  characterIndex: number
}

const ScriptView: React.FC<Props> = ({ className, script }) => {
  const rolesColors: Record<RoleType, string> = {}
  const [cursorPos, setCursorPos] = useState<CursorPos | null>({ lineIndex: 0, characterIndex: 0 })
  const [showCursor, setShowCursor] = useState<boolean>(true)

  useWindowEvent(
    "keydown",
    (e: KeyboardEvent) => {
      const addCharcaterIndex: number =
        (e.key === "ArrowRight" ? 1 : 0) + (e.key === "ArrowLeft" ? -1 : 0)
      const addLineIndex: number = (e.key === "ArrowDown" ? 1 : 0) + (e.key === "ArrowUp" ? -1 : 0)

      const newCursorPos = cursorPos
        ? {
            lineIndex: cursorPos.lineIndex + addLineIndex,
            characterIndex: cursorPos.characterIndex + addCharcaterIndex,
          }
        : { lineIndex: 0, characterIndex: 0 }

      setCursorPos(newCursorPos)
    },
    [],
  )

  // useInterval(() => setShowCursor(!showCursor), 500)

  script.rolesMeta.forEach(
    (roleMeta, i) => (rolesColors[roleMeta.role] = ROLES_COLORS[i % ROLES_COLORS.length]),
  )

  const linesElements = script.lines.map((line, i) => {
    const textElem =
      showCursor && cursorPos && cursorPos.lineIndex === i ? (
        <span>
          <span>{line.text.substring(0, cursorPos.characterIndex)}</span>
          <Cursor />
          <span>{line.text.substring(cursorPos.characterIndex)}</span>
        </span>
      ) : (
        <span>{line.text}</span>
      )

    return (
      <Line key={i}>
        {line.type === SCRIPT_LINE_TYPE_ACTION ? (
          <span>
            <span>[</span>
            {textElem}
            <span>]</span>
          </span>
        ) : (
          <span>
            <Role color={rolesColors[line.role]}>{line.role}</Role>: {textElem}
          </span>
        )}
      </Line>
    )
  })

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
        {linesElements}
      </BackgroundPaper>
    </Wrapper>
  )
}

export default ScriptView
