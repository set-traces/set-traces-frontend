import React, { useEffect, useState } from "react"
import { Role as RoleType, ScriptLine } from "../../api/dataTypes"
import { Editor, EditorState } from "draft-js"
import { createEditorState, updateChangedEditorState } from "./editorStateHandling"
import styled from "styled-components"
import "./draftStyles.css"
import { EditableScriptLinesState } from "./editableScriptLinesState"

export type ScriptLineChangeCallback = (
  lineIndex: number,
  line: ScriptLine,
  prevLine: ScriptLine,
) => void
export type ScriptLineAddCallback = (lineIndex: number, line: ScriptLine) => void
export type ScriptLineRemoveCallback = (lineIndex: number, prevLine: ScriptLine) => void

export enum ScriptLineDeltaType {
  ADD = "ADD",
  REMOVE = "REMOVE",
  MODIFY = "MODIFY",
}
export type ScriptLineAddDelta = {
  type: typeof ScriptLineDeltaType.ADD
  lineIndex: number
  scriptLine: ScriptLine
}
export type ScriptLineRemoveDelta = {
  type: typeof ScriptLineDeltaType.REMOVE
  lineIndex: number
  scriptLine: ScriptLine
}

export type ScriptLineModifyDelta = {
  type: typeof ScriptLineDeltaType.MODIFY
  lineIndex: number
  scriptLine: ScriptLine
}

export type ScriptLineDelta = ScriptLineAddDelta | ScriptLineRemoveDelta | ScriptLineModifyDelta

type Props = {
  className?: string
  scriptLinesState: EditableScriptLinesState
  editable?: boolean
  onChange?: (scriptLinesState: EditableScriptLinesState, deltas: ScriptLineDelta[]) => void
  onLineChange?: ScriptLineChangeCallback
  onLineAdd?: ScriptLineAddCallback
  onLineRemove?: ScriptLineRemoveCallback
}

const Wrapper = styled.span`
  //line-height: 1.5;
`

const ScriptLinesEditor: React.FC<Props> = ({
  className,
  scriptLinesState,
  editable = true,
  onChange,
}) => {
  // const [scriptLinesState, setScriptLinesState] = useState<EditableScriptLinesState | undefined>(undefined)
  // const [scriptMetaEntityKey, setScriptMetaEntityKey] = useState<string | undefined>(undefined)

  // useEffect(() => {
  //   const { editorState: initialEditorState, scriptMetaEntityKey } = createEditorState(
  //     scriptLines,
  //     rolesColors,
  //   )
  //   setScriptMetaEntityKey(scriptMetaEntityKey)
  //   setEditorState(initialEditorState)
  //
  //   // rolesColors change should be handled by updating the scriptMetaEntity, dont include in dependency list now
  // }, [])

  const handleEditorChange = (editorState: EditorState) => {
    const changedScriptLinesState = new EditableScriptLinesState(
      editorState,
      scriptLinesState.scriptMetaEntityKey,
    )
    const [modifiedScriptLinesState, deltas] = updateChangedEditorState(changedScriptLinesState)
    // if deltas are not null, a change have been made
    if (deltas) {
      onChange && onChange(modifiedScriptLinesState, deltas)
    }
  }

  return (
    <Wrapper className={className}>
      {scriptLinesState ? (
        <Editor
          editorState={scriptLinesState.editorState}
          onChange={handleEditorChange}
          readOnly={!editable}
        />
      ) : (
        <span>Two sec...</span>
      )}
    </Wrapper>
  )
}

export default ScriptLinesEditor
