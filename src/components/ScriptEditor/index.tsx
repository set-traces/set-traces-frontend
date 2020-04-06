import React, { useEffect, useState } from "react"
import { Role as RoleType, Script, ScriptLine, ScriptLineType } from "../../api/dataTypes"
import { BackgroundPaper, ScriptHeader, Wrapper } from "./elements"
import { theme } from "../../Theme"
import ScriptLinesEditor, { ScriptLineDelta } from "../ScriptLinesEditor"
import { EditableScriptLinesState } from "../ScriptLinesEditor/editableScriptLinesState"
import useRemoteScriptUpdate from "./useRemoteScriptUpdate"

export type ScriptLineChangeCallback = (
  lineIndex: number,
  line: ScriptLine,
  prevLine: ScriptLine,
) => void
export type ScriptLineAddCallback = (lineIndex: number, line: ScriptLine) => void
export type ScriptLineRemoveCallback = (lineIndex: number, prevLine: ScriptLine) => void

type Props = {
  className?: string
  script: Script
}

const COLOR_ALPHA = "aa"
const ROLES_COLORS = [
  theme.colors.undertone + COLOR_ALPHA,
  theme.colors.negative + COLOR_ALPHA,
  theme.colors.positive + COLOR_ALPHA,
  theme.colors.negativeIsh + COLOR_ALPHA,
  theme.colors.highlight + COLOR_ALPHA,
]

const ScriptEditor: React.FC<Props> = ({ className, script }) => {
  const [rolesColors, setRolesColors] = useState<Record<RoleType, string> | undefined>(undefined)
  const [scriptLineState, setScriptLineState] = useState<EditableScriptLinesState | undefined>(
    undefined,
  )

  useEffect(() => {
    const rolesColors: Record<RoleType, string> = {}
    script.rolesMeta.forEach((roleMeta, i) => {
      rolesColors[roleMeta.role] = ROLES_COLORS[i % ROLES_COLORS.length]
    })
    setRolesColors(rolesColors)
    setScriptLineState(EditableScriptLinesState.createFromScriptLines(script.lines, rolesColors))
  }, [script])

  useRemoteScriptUpdate(scriptLineState, setScriptLineState)

  const handleScriptLinesChange = (
    scriptLinesState: EditableScriptLinesState,
    deltas: ScriptLineDelta[],
  ) => {
    console.log("Deltas:", deltas)
    const insertRandom = Math.random() < 0.2
    if (insertRandom) {
      const lineIndex = Math.floor(Math.random() * scriptLinesState.getLinesCount())
      setScriptLineState(
        scriptLinesState.modifyScriptLine(
          {
            type: ScriptLineType.ACTION,
            roles: [],
            text: "PRRRRRRRA",
          },
          0,
        ),
      )
    } else {
      setScriptLineState(scriptLinesState)
    }
  }

  return (
    <Wrapper className={className}>
      <BackgroundPaper>
        {rolesColors && scriptLineState && (
          <>
            <ScriptHeader script={script} rolesColors={rolesColors} />
            <ScriptLinesEditor
              scriptLinesState={scriptLineState}
              onChange={handleScriptLinesChange}
              editable={true}
            />
          </>
        )}
      </BackgroundPaper>
    </Wrapper>
  )
}

export default ScriptEditor
