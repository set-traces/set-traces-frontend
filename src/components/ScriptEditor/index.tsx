import React, { useState } from "react"
import { Role as RoleType, Script, ScriptLineType } from "../../api/dataTypes"
import { BackgroundPaper, Wrapper, ScriptHeader, Role } from "./elements"
import Draft, {
  CompositeDecorator,
  ContentState,
  DraftDecorator,
  Editor,
  EditorState,
  ContentBlock,
  genKey,
} from "draft-js"
import styled from "styled-components"
import { theme } from "../../Theme"

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

const roleDecorator: DraftDecorator = {
  strategy: (contentBlock, callback, contentState) => {
    const text = contentBlock.getText()

    if (text.includes(":")) {
      callback(0, text.indexOf(":"))
    }
  },
  component: Role,
}

const compositDecorator = new CompositeDecorator([roleDecorator])

let initialEditorState = EditorState.createEmpty(compositDecorator)
const contentState = initialEditorState.getCurrentContent()

const ScriptEditor: React.FC<Props> = ({ className, script }) => {
  const rolesColors: Record<RoleType, string> = {}
  script.rolesMeta.forEach(
    (roleMeta, i) => (rolesColors[roleMeta.role] = ROLES_COLORS[i % ROLES_COLORS.length]),
  )

  const scriptContentBlockArray: ContentBlock[] = script.lines
    .map((line): ContentBlock[] => {
      switch (line.type) {
        case ScriptLineType.REMARK:
          return [
            new ContentBlock({
              key: genKey(),
              type: "unstyled",
              text: line.role + ": ",
              data: { color: rolesColors[line.role] },
            }),
            new ContentBlock({
              key: genKey(),
              type: "unstyled",
              text: line.text,
            }),
          ]
        default:
          return [new ContentBlock({ key: genKey(), type: "unstyled", text: line.text })]
      }
    })
    .flatMap((contentBlockArray) => contentBlockArray)

  // .contentState.createEntity("role", "mutable", { color })

  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.push(
      initialEditorState,
      ContentState.createFromBlockArray(new Array<ContentBlock>(...scriptContentBlockArray)),
      "insert-characters",
    ),
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
