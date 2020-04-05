import { ContentState, EditorState } from "draft-js"
import { Role, ScriptLine } from "../../api/dataTypes"
import { createBlocksFromScriptLines } from "./scriptLineBlockConversion"
import {
  addScriptMetaEntity,
  getScriptMetaEntityData,
  setScriptLineOfBlock,
} from "./customDraft/customDraftUtils"
import { createScriptLineDecorators } from "./scriptLineDecorators"
import { lineFromRawText } from "./scriptLineHandling"
import { EditorChangeType } from "./customDraft/missingDraftEnums"

export const createEditorState = (
  scriptLines: ScriptLine[],
  rolesColors: Record<Role, string>,
): { editorState: EditorState; scriptMetaEntityKey: string } => {
  const scriptLinesContentBlocks = createBlocksFromScriptLines(scriptLines)
  const contentStateWithoutEntity = ContentState.createFromBlockArray(scriptLinesContentBlocks)
  const { contentState: initialContentState, entityKey } = addScriptMetaEntity(
    contentStateWithoutEntity,
    rolesColors,
  )
  const initialEditorState = EditorState.createWithContent(
    initialContentState,
    createScriptLineDecorators(entityKey),
  )
  return { editorState: initialEditorState, scriptMetaEntityKey: entityKey }
}

export const updateChangedEditorState = (
  editorState: EditorState,
  scriptMetaEntityKey: string,
): EditorState => {
  if (
    [
      EditorChangeType.insertCharacters,
      EditorChangeType.backspaceCharacter,
      EditorChangeType.deleteCharacters,
      EditorChangeType.splitBlock,
      EditorChangeType.insertFragment,
      EditorChangeType.removeRange,
    ].includes(editorState.getLastChangeType() as EditorChangeType)
  ) {
    const contentState = editorState.getCurrentContent()
    const selectionState = editorState.getSelection()
    const contentBlock = contentState.getBlockForKey(selectionState.getAnchorKey())
    const rawText = contentBlock.getText()

    const existingRoles = Object.keys(
      getScriptMetaEntityData(contentState, scriptMetaEntityKey).rolesColors,
    )
    const newScriptLine = lineFromRawText(rawText, existingRoles)
    const newContentState = setScriptLineOfBlock(contentState, selectionState, newScriptLine)
    return EditorState.push(editorState, newContentState, EditorChangeType.changeBlockData)
  }

  return editorState
}
