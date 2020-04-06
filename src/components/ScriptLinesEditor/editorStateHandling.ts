import Draft, { ContentState, EditorState, SelectionState, Modifier } from "draft-js"
import { Role, ScriptLine } from "../../api/dataTypes"
import { createBlockFromScriptLine, createBlocksFromScriptLines } from "./scriptLineBlockConversion"
import {
  addScriptMetaEntity,
  getScriptMetaEntityData,
  setScriptLineOfBlock,
} from "./customDraft/customDraftUtils"
import { createScriptLineDecorators } from "./scriptLineDecorators"
import { lineFromRawText } from "./scriptLineHandling"
import { EditorChangeType } from "./customDraft/missingDraftEnums"
import { ScriptLineDelta, ScriptLineDeltaType } from "./index"
import { EditableScriptLinesState } from "./editableScriptLinesState"
import { OrderedMap } from "immutable"

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
  scriptLinesState: EditableScriptLinesState,
): [EditableScriptLinesState, ScriptLineDelta[] | null] => {
  const editorState = scriptLinesState.editorState
  const scriptMetaEntityKey = scriptLinesState.scriptMetaEntityKey
  console.log("handle change prev type:", editorState.getLastChangeType())
  if (
    // [
    //   EditorChangeType.insertCharacters,
    //   EditorChangeType.backspaceCharacter,
    //   EditorChangeType.deleteCharacters,
    //   EditorChangeType.splitBlock,
    //   EditorChangeType.insertFragment,
    //   EditorChangeType.removeRange,
    //   EditorChangeType.undo,
    //   EditorChangeType.redo,
    // ].includes(editorState.getLastChangeType() as EditorChangeType)
    true
  ) {
    const contentState = editorState.getCurrentContent()
    const selectionState = editorState.getSelection()
    const contentBlock = contentState.getBlockForKey(selectionState.getAnchorKey())
    const rawText = contentBlock.getText()
    const contentBlockIndex = contentState.getBlocksAsArray().indexOf(contentBlock)

    const existingRoles = Object.keys(
      getScriptMetaEntityData(contentState, scriptMetaEntityKey).rolesColors,
    )
    const newScriptLine = lineFromRawText(rawText, existingRoles)
    const newContentState = setScriptLineOfBlock(contentState, selectionState, newScriptLine)
    const deltas: ScriptLineDelta[] = [
      {
        type: ScriptLineDeltaType.MODIFY,
        lineIndex: contentBlockIndex,
        scriptLine: newScriptLine,
      },
    ]
    const currBlockIndex = contentState.getBlocksAsArray().indexOf(contentBlock)
    const newLineState = scriptLinesState.modifyScriptLine(
      newScriptLine,
      currBlockIndex,
      editorState.getLastChangeType()
        ? (editorState.getLastChangeType() as EditorChangeType)
        : EditorChangeType.insertCharacters,
    )
    return [newLineState, deltas]
    // return [
    //   EditableScriptLinesState.createFromEditorState(
    //     scriptLinesState,
    //     EditorState.push(editorState, newContentState, EditorChangeType.changeBlockData),
    //   ),
    //   deltas,
    // ]
  }

  return [scriptLinesState, null]
}

export const modifyScriptLine = (
  editorState: EditorState,
  newScriptLine: ScriptLine,
  index: number,
  scriptMetaEntityKey: string,
  changeType: EditorChangeType = EditorChangeType.insertCharacters,
): EditorState => {
  const currContentState = editorState.getCurrentContent()
  const blockAtIndex = currContentState.getBlocksAsArray()[index]
  const newBlock = createBlockFromScriptLine(
    newScriptLine,
    scriptMetaEntityKey,
    blockAtIndex.getKey(),
  )
  const newContentFragment = OrderedMap({ [newBlock.getKey()]: newBlock })
  const newContentState = Modifier.replaceWithFragment(
    currContentState,
    new SelectionState({
      anchorKey: blockAtIndex.getKey(),
      focusKey: blockAtIndex.getKey(),
      anchorOffset: 0,
      focusOffset: blockAtIndex.getLength(),
    }),
    newContentFragment,
  )

  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    EditorChangeType.insertFragment,
  )
  const prevSelection = editorState.getSelection()

  // move the cursor to the end of the line if the new line is shorter. By default the cursor is put at the start
  const newAnchorOffset =
    prevSelection.getAnchorKey() === blockAtIndex.getKey()
      ? Math.min(newBlock.getLength(), prevSelection.getAnchorOffset())
      : prevSelection.getAnchorOffset()
  const newFocusOffset =
    prevSelection.getFocusKey() === blockAtIndex.getKey()
      ? Math.min(newBlock.getLength(), prevSelection.getFocusOffset())
      : prevSelection.getFocusOffset()
  const newSelection = new SelectionState(
    prevSelection.merge({ anchorOffset: newAnchorOffset, focusOffset: newFocusOffset }),
  )
  return EditorState.forceSelection(newEditorState, newSelection)
  // console.log("last change type", editorState.getLastChangeType())
  // const existingContentState = editorState.getCurrentContent()
  // const existingBlocks = existingContentState.getBlocksAsArray()
  // const existingBlockToBeModified = existingBlocks[index]
  // const newBlock = createBlockFromScriptLine(
  //   newScriptLine,
  //   scriptMetaEntityKey,
  //   existingBlockToBeModified.getKey(),
  // )
  // const newBlocks = existingBlocks.map((block) =>
  //   block === existingBlockToBeModified ? newBlock : block,
  // )
  // const newContentState = ContentState.createFromBlockArray(newBlocks)
  // const newEditorState = EditorState.push(
  //   editorState,
  //   newContentState,
  //   EditorChangeType.insertFragment,
  //   // newBlock.getText() === existingBlockToBeModified.getText()
  //   //   ? EditorChangeType.changeBlockData
  //   //   : changeType,
  // )
  // const newSelection = existingContentState.getSelectionAfter() //new SelectionState(editorState.getSelection().merge({}))
  // console.log("new selection", newSelection)
  // return EditorState.forceSelection(newEditorState, editorState.getSelection())
}

const addScriptLine = (
  editorState: EditorState,
  scriptLine: ScriptLine,
  index: number,
): EditorState => EditorState.createEmpty()

const removeScriptLine = (editorState: EditorState, index: number): EditorState =>
  EditorState.createEmpty()
