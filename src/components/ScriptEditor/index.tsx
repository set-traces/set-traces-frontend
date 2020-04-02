import React, { useState } from "react"
import {
  Role as RoleType,
  RoleMeta,
  Script,
  ScriptLineRemark,
  ScriptLineType,
} from "../../api/dataTypes"
import { BackgroundPaper, Wrapper, ScriptHeader, Role } from "./elements"
import Draft, {
  CompositeDecorator,
  ContentState,
  DraftDecorator,
  Editor,
  EditorState,
  ContentBlock,
  genKey,
  DraftEntityMutability,
  CharacterMetadata,
} from "draft-js"
import styled from "styled-components"
import { theme } from "../../Theme"
import { createArrayOfRange } from "../../utils/arrayUtils"
import {
  createEditorStateFromScript,
  createRoleEntities,
  createScriptLinesBlocks,
} from "./contentModification"

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
  const rolesColors: Record<RoleType, string> = {}
  script.rolesMeta.forEach((roleMeta, i) => {
    rolesColors[roleMeta.role] = ROLES_COLORS[i % ROLES_COLORS.length]
  })

  const [editorState, setEditorState] = useState<EditorState>(
    createEditorStateFromScript(script, rolesColors),
  )

  const handleEditorChange = (editorState: EditorState) => {
    setEditorState(editorState)
  }

  return (
    <Wrapper className={className}>
      <BackgroundPaper>
        <ScriptHeader script={script} rolesColors={rolesColors} />

        <Editor editorState={editorState} onChange={handleEditorChange} />
      </BackgroundPaper>
    </Wrapper>
  )
}

export default ScriptEditor
