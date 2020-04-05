import React, { useEffect, useState } from "react"
import { Role as RoleType, Script, ScriptLine } from "../../api/dataTypes"
import { Editor, EditorState } from "draft-js"
import { createEditorState, updateChangedEditorState } from "./editorStateHandling"

export type ScriptLineChangeCallback = (
  lineIndex: number,
  line: ScriptLine,
  prevLine: ScriptLine,
) => void
export type ScriptLineAddCallback = (lineIndex: number, line: ScriptLine) => void
export type ScriptLineRemoveCallback = (lineIndex: number, prevLine: ScriptLine) => void

type Props = {
  className?: string
  initialScript: Script
  rolesColors: Record<RoleType, string>
  editable?: boolean
  onLineChange?: ScriptLineChangeCallback
  onLineAdd?: ScriptLineAddCallback
  onLineRemove?: ScriptLineRemoveCallback
}

const ScriptLinesEditor: React.FC<Props> = ({
  className,
  initialScript,
  rolesColors,
  editable = true,
}) => {
  const [editorState, setEditorState] = useState<EditorState | undefined>(undefined)
  const [scriptMetaEntityKey, setScriptMetaEntityKey] = useState<string | undefined>(undefined)

  useEffect(() => {
    const { editorState: initialEditorState, scriptMetaEntityKey } = createEditorState(
      initialScript.lines,
      rolesColors,
    )
    setScriptMetaEntityKey(scriptMetaEntityKey)
    setEditorState(initialEditorState)

    // rolesColors change should be handled by updating the scriptMetaEntity, dont include in dependency list now
  }, [initialScript])

  const handleEditorChange = (editorState: EditorState) => {
    if (scriptMetaEntityKey) {
      const modifiedEditorState = updateChangedEditorState(editorState, scriptMetaEntityKey)
      setEditorState(modifiedEditorState)
    }
  }

  return (
    <span className={className}>
      {editorState && scriptMetaEntityKey ? (
        <Editor editorState={editorState} onChange={handleEditorChange} readOnly={!editable} />
      ) : (
        <span>Two sec...</span>
      )}
    </span>
  )
}

export default ScriptLinesEditor
