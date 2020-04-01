import React, { useState } from "react"
import { Editor, EditorState } from "draft-js"
import { Script } from "../../api/dataTypes"
import { Wrapper, BackgroundPaper } from "./elements"

type Props = {
  className?: string
  script: Script
}

const ScriptEditor: React.FC<Props> = ({ className }) => {
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty())

  const handleEditorChange = (editorState: EditorState) => {
    setEditorState(editorState)
  }

  return (
    <Wrapper className={className}>
      <BackgroundPaper>
        <Editor editorState={editorState} onChange={handleEditorChange} />
      </BackgroundPaper>
    </Wrapper>
  )
}

export default ScriptEditor
