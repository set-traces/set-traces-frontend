import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react"
import { RoleMeta, Script, ScriptLine, ScriptLineType } from "../../api/dataTypes"
import styled from "styled-components"
import { theme } from "../../Theme"
import ReactQuill, { Quill } from "react-quill"
import { UnprivilegedEditor } from "./ReactQuillTypesRedeclare"
import * as QuillTypes from "quill"

import "react-quill/dist/quill.core.css"
import "./customQuillStyles.css"
import { registerCustomBlots } from "./customBlots"
import useDebounce from "../../hooks/timing"

type Props = {
  className?: any
  script: Script
}

const Wrapper = styled.div`
  //margin-bottom: 100px;
  width: 100%;
`

const BackgroundPaper = styled.div`
  background-color: #fff;
  box-shadow: 0px 0px 1px 1px rgba(214, 214, 214, 1);
  //padding: 0 10% 100px 10%;
  //width: ${800 - 96 * 2}px;
  //min-width: 400px;
  width: 100%;
  padding: 96px;
  box-sizing: border-box;
  //display: flex;
  //flex-direction: column;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  //font-size: 14px;
`

const COLOR_ALPHA = "aa"
const ROLES_COLORS = [
  theme.colors.undertone + COLOR_ALPHA,
  theme.colors.negative + COLOR_ALPHA,
  theme.colors.positive + COLOR_ALPHA,
  theme.colors.negativeIsh + COLOR_ALPHA,
  theme.colors.highlight + COLOR_ALPHA,
]

const Delta = Quill.import("delta")

const lineActionPrefix = "*"

const mapEditorContentsToLines = (linesText: string[], rolesMeta: RoleMeta[]): ScriptLine[] => {
  // console.log("Line deltas:")
  // delta.eachLine((lineDelta: QuillTypes.Delta, attributes) => {
  //   console.log(lineDelta)
  //   // assuming delete deltas will not be present
  // })
  const roles = rolesMeta.map((roleMeta) => roleMeta.role)

  return linesText.map((lineText) => {
    if (lineText.startsWith(lineActionPrefix)) {
      return {
        type: ScriptLineType.ACTION,
        roles: [],
        text: lineText.slice(lineActionPrefix.length),
      }
    }
    // check if a role is present
    if (lineText.includes(": ")) {
      const [lineRole, restText] = lineText.split(": ", 2)
      if (roles.includes(lineRole)) {
        return {
          type: ScriptLineType.REMARK,
          role: lineRole,
          text: restText,
        }
      }
    }

    return {
      type: ScriptLineType.COMMENT,
      text: lineText,
    }
  })
}

const mapScriptLinesToEditorContent = (scriptLines: ScriptLine[]): QuillTypes.Delta => {
  const lineDeltas: QuillTypes.Delta[] = scriptLines.map((scriptLine: ScriptLine) => {
    switch (scriptLine.type) {
      case ScriptLineType.REMARK:
        return new Delta()
          .insert(scriptLine.role, { role: true })
          .insert(": ")
          .insert(scriptLine.text)
          .insert("\n")
      case ScriptLineType.ACTION:
        return new Delta().insert(lineActionPrefix).insert(scriptLine.text).insert("\n")
      case ScriptLineType.COMMENT:
        return new Delta().insert(scriptLine.text, { comment: true }).insert("\n")
      default:
        return new Delta().insert("\n")
    }
  })
  return lineDeltas.reduce((acc, curr) => curr.compose(acc), new Delta())
}

registerCustomBlots()

// const quillModules =
const defaultValue = new Delta([])
const formats = [
  "role",
  "comment",
  "header",
  "bold",
  "italic",
  "underline",
  "link",
  "strike",
  "clean",
]

const ScriptEditor: React.FC<Props> = (props) => {
  const { className, script: initialScript } = props

  const modules = useRef({
    toolbar: [],
  })

  const [script, setScript] = useState<Script>(initialScript)

  const [editorContent, setEditorContent] = useState<QuillTypes.Delta>(
    mapScriptLinesToEditorContent(initialScript.lines),
  )

  const editorRef = useRef<ReactQuill | null>(null)

  useEffect(() => {
    if (script) {
      const delta = mapScriptLinesToEditorContent(script.lines)
      setEditorContent(delta)
    }
  }, [script])

  const handleQuillChange = useCallback(
    (
      content: string,
      changeDelta: QuillTypes.Delta,
      source: QuillTypes.Sources,
      editor: UnprivilegedEditor,
    ) => {
      console.log("source", source)
      // source user means that the content was changed by the user
      // should not map the content to our format if the content was changed as a response to our format change
      if (source === "user") {
        const selection = editor.getSelection()
        // console.log("selection", selection)
        // console.log("content", content)
        const allLinesText = editor.getText().split("\n")
        const scriptLines = mapEditorContentsToLines(allLinesText, script.rolesMeta)

        // setTimeout(() => setScript({ ...script, lines: scriptLines }), 5)
        setScript({ ...script, lines: scriptLines })
      }
    },
    [script],
  )

  console.log("editor content", editorContent)

  return (
    <Wrapper className={className}>
      <BackgroundPaper key={script.id + "1"} id={script.id + "1"}>
        <ReactQuill
          ref={editorRef}
          key={script.id}
          id={script.id}
          // workaround as using the value prop gives error
          // defaultValue={editorContent}
          value={editorContent}
          onChange={handleQuillChange}
          modules={modules.current}
          formats={formats}
          theme={undefined}
        />
      </BackgroundPaper>
    </Wrapper>
  )
}

export default ScriptEditor
