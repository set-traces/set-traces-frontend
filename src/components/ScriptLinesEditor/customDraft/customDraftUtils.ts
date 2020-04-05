import { Role, ScriptLine } from "../../../api/dataTypes"
import { EditorState, SelectionState, ContentState, ContentBlock, Modifier, genKey } from "draft-js"
import { Map } from "immutable"

export type ScriptMetaEntityData = {
  rolesColors: Record<Role, string>
}

export type ScriptLineBlockData = {
  scriptLine: ScriptLine
  scriptMetaEntityKey: string
}

export const addScriptMetaEntity = (
  contentState: ContentState,
  rolesColors: Record<Role, string>,
): { contentState: ContentState; entityKey: string } => {
  const newContentState = contentState.createEntity("SCRIPT-META", "MUTABLE", {
    rolesColors: rolesColors,
  })
  return { contentState: newContentState, entityKey: contentState.getLastCreatedEntityKey() }
}

export const addScriptMetaEntityAndSetInBlocks = (
  contentState: ContentState,
  rolesColors: Record<Role, string>,
): ContentState => {
  const { contentState: contentStateWithScriptMetaEntity, entityKey } = addScriptMetaEntity(
    contentState,
    rolesColors,
  )
  const contentStateWithScriptMetaEntityKeyInBlocks = setScriptMetaEntityKeyOfBlock(
    contentStateWithScriptMetaEntity,
    new SelectionState({
      anchorKey: contentStateWithScriptMetaEntity.getFirstBlock().getKey(),
      anchorOffset: 0,
      focusKey: contentStateWithScriptMetaEntity.getLastBlock().getKey(),
      focusOffset: 0,
    }),
    entityKey,
  )
  return contentStateWithScriptMetaEntityKeyInBlocks
}

export const getScriptMetaEntityData = (
  contentState: ContentState,
  scriptMetaEntityKey: string,
): ScriptMetaEntityData => {
  const scriptMetaEntityData = contentState
    .getEntity(scriptMetaEntityKey)
    .getData() as ScriptMetaEntityData
  return scriptMetaEntityData
}

export const setScriptLineOfBlock = (
  contentState: ContentState,
  selectionState: SelectionState,
  scriptLine: ScriptLine,
): ContentState => {
  const newContentState = Modifier.mergeBlockData(
    contentState,
    selectionState,
    Map({
      scriptLine,
    }),
  )
  return newContentState
}

export const setScriptMetaEntityKeyOfBlock = (
  contentState: ContentState,
  selectionState: SelectionState,
  scriptMetaEntityKey: string,
): ContentState => {
  const newContentState = Modifier.mergeBlockData(
    contentState,
    selectionState,
    Map({
      scriptMetaEntityKey,
    }),
  )
  return newContentState
}

export const getScriptLineBlockData = (contentBlock: ContentBlock): ScriptLineBlockData => {
  return contentBlock.getData().toObject() as ScriptLineBlockData
}

export const createScriptLineBlock = (
  text: string,
  scriptLineBlockData: ScriptLineBlockData,
  key?: string,
): ContentBlock => {
  return new ContentBlock({
    key: key ? key : genKey(),
    type: "paragraph",
    text,
    data: Map({
      ...scriptLineBlockData,
    }),
  })
}
