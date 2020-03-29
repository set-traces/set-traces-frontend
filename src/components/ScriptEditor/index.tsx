import React, { useState } from "react"
import { Script } from "../../api/dataTypes"
import styled from "styled-components"
import { theme } from "../../Theme"

import ReactQuill, { Quill } from "react-quill"
import * as RawQuill from "quill"
import "react-quill/dist/quill.core.css"
// @ts-ignore
import { addRoleBlot } from "./roleBlot"
import { default as Delta } from "quill-delta"

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

const COLOR_ALPHA = "aa"
const ROLES_COLORS = [
  theme.colors.undertone + COLOR_ALPHA,
  theme.colors.negative + COLOR_ALPHA,
  theme.colors.positive + COLOR_ALPHA,
  theme.colors.negativeIsh + COLOR_ALPHA,
  theme.colors.highlight + COLOR_ALPHA,
]

addRoleBlot()

const ScriptEditor: React.FC<Props> = (props) => {
  const { className, script: initialScript } = props

  // const rolesColors: Record<RoleType, string> = {}
  // script.rolesMeta.forEach(
  //   (roleMeta, i) => (rolesColors[roleMeta.role] = ROLES_COLORS[i % ROLES_COLORS.length]),
  // )

  const [value, setValue] = useState<any>(new Delta().insert("PRRA", { rblot: true }))

  const handleQuillChange = (
    content: string,
    rdelta: RawQuill.Delta,
    source: RawQuill.Sources,
    editor: any,
  ) => {
    const delta = editor.getContents()
    const selection = editor.getSelection()
    console.log("selection", selection)
    console.log("content", content)
    // setValue((editor.getContents() as any).insert("hei"))
    if (selection && selection.index) {
      // setValue(new Delta([{ retain: selection.index }, { insert: "PRRRRRRA" }]))
    }
  }

  return (
    <Wrapper className={className}>
      <BackgroundPaper>
        <ReactQuill
          value={value}
          onChange={handleQuillChange}
          modules={{
            toolbar: false,
            //   [
            //   // [{ header: [1, 2, false] }],
            //   ["bold", "italic", "underline", "strike"],
            //   ["link"],
            //   ["clean"],
            // ],
          }}
          formats={["header", "bold", "italic", "underline", "link", "strike", "clean"]}
          theme={undefined}
        />
      </BackgroundPaper>
    </Wrapper>
  )
}

export default ScriptEditor
