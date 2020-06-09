import React, { useEffect, useState } from "react"
import { Role as RoleType, Script, ScriptLine } from "../../api/dataTypes"
import { BackgroundPaper, ScriptHeader, Wrapper } from "./elements"
import { theme } from "../../Theme"
import ScriptLinesEditor from "../ScriptLinesEditor"

export type ScriptLineChangeCallback = (
  lineIndex: number,
  line: ScriptLine,
  prevLine: ScriptLine,
) => void
export type ScriptLineAddCallback = (lineIndex: number, line: ScriptLine) => void
export type ScriptLineRemoveCallback = (lineIndex: number, prevLine: ScriptLine) => void

type Props = {
  projectId: string
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

const ScriptEditor: React.FC<Props> = ({ projectId, className, script }) => {
  const [rolesColors, setRolesColors] = useState<Record<RoleType, string> | undefined>(undefined)

  useEffect(() => {
    const rolesColors: Record<RoleType, string> = {}
    script.rolesMeta.forEach((roleMeta, i) => {
      rolesColors[roleMeta.role] = ROLES_COLORS[i % ROLES_COLORS.length]
    })
    setRolesColors(rolesColors)
  }, [script])

  return (
    <Wrapper className={className}>
      <BackgroundPaper>
        {rolesColors && (
          <>
            <ScriptHeader key={script.id} projectId={projectId} script={script} rolesColors={rolesColors} />
            <ScriptLinesEditor initialScript={script} rolesColors={rolesColors} editable={true} />
          </>
        )}
      </BackgroundPaper>
    </Wrapper>
  )
}

export default ScriptEditor
