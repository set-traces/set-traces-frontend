import Draft, { EditorState } from "draft-js"
import { Role, ScriptLine } from "../../api/dataTypes"
import { createEditorState } from "./editorStateHandling"
import * as editorStateHandling from "./editorStateHandling"
import { EditorChangeType } from "./customDraft/missingDraftEnums"
import { getScriptLineBlockData } from "./customDraft/customDraftUtils"

// export type EditableScriptLineState = {
//   editorState: EditorState,
//   addScriptLine: (scriptLine: ScriptLine, index: number) => EditableScriptLineState
//   removeScriptLine: (index: number) => EditableScriptLineState
//   changeLine: (newScriptLine: ScriptLine, index: number) => EditableScriptLineState
// }

export class EditableScriptLinesState {
  public static createFromScriptLines = (
    scriptLines: ScriptLine[],
    rolesColors: Record<Role, string>,
  ): EditableScriptLinesState => {
    const { editorState, scriptMetaEntityKey } = createEditorState(scriptLines, rolesColors)
    return new EditableScriptLinesState(editorState, scriptMetaEntityKey)
  }

  static createFromEditorState = (
    scriptLinesState: EditableScriptLinesState,
    editorState: EditorState,
  ) => new EditableScriptLinesState(editorState, scriptLinesState.scriptMetaEntityKey)

  readonly editorState: EditorState
  readonly scriptMetaEntityKey: string

  constructor(editorState: EditorState, scriptMetaEntityKey: string) {
    this.editorState = editorState
    this.scriptMetaEntityKey = scriptMetaEntityKey
  }

  // addScriptLine = (scriptLine: ScriptLine, index: number): EditableScriptLinesState =>
  //   new EditableScriptLinesState(addScriptLine(this.editorState, scriptLine, index))
  //
  // removeScriptLine: (index: number) => EditableScriptLinesState

  public getAllLines = (): ScriptLine[] =>
    this.editorState
      .getCurrentContent()
      .getBlocksAsArray()
      .map((block) => getScriptLineBlockData(block).scriptLine)

  public getLinesCount = (): number =>
    this.editorState.getCurrentContent().getBlocksAsArray().length

  public modifyScriptLine = (
    newScriptLine: ScriptLine,
    index: number,
    changeType?: EditorChangeType,
  ): EditableScriptLinesState => {
    const newEditorState = editorStateHandling.modifyScriptLine(
      this.editorState,
      newScriptLine,
      index,
      this.scriptMetaEntityKey,
      changeType,
    )
    return new EditableScriptLinesState(newEditorState, this.scriptMetaEntityKey)
  }
}
