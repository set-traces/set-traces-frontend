import {
  Role,
  Role as RoleType,
  RoleMeta,
  Script,
  ScriptLine,
  ScriptLineAction,
  ScriptLineComment,
  ScriptLineRemark,
  ScriptLineType,
} from "../../api/dataTypes"
import Draft, {
  CharacterMetadata,
  CompositeDecorator,
  ContentBlock,
  ContentState,
  DraftDecorator,
  EditorState,
  genKey,
  SelectionState,
  Modifier,
} from "draft-js"
import { createArrayOfRange } from "../../utils/arrayUtils"
import { CharacterMetadataConfig } from "./missingDraftTypes"
import { List, Map } from "immutable"
import { InlineRole } from "./elements"
import * as scriptLineHandling from "./scriptLineHandling"
import { EditorChangeType } from "./missingDraftEnums"

export type RolesEntityKeys = Record<RoleType, string>

type ContentStateWithRoleEntityKeys = {
  contentState: ContentState
  roleEntityKeys: RolesEntityKeys
}

export const createRoleEntities = (
  rolesMeta: RoleMeta[],
  contentState: ContentState,
  rolesColors: Record<RoleType, string>,
): ContentStateWithRoleEntityKeys => {
  const initialValue: ContentStateWithRoleEntityKeys = {
    contentState: contentState,
    roleEntityKeys: {},
  }

  return rolesMeta.reduce((acc, roleMeta, i) => {
    const entityType = "ROLE"
    const roleColor = rolesColors[roleMeta.role]
    const newContentState = acc.contentState.createEntity(entityType, "MUTABLE", {
      color: roleColor,
    })
    const entityKey = newContentState.getLastCreatedEntityKey()
    return {
      contentState: newContentState,
      roleEntityKeys: { ...acc.roleEntityKeys, [roleMeta.role]: entityKey },
    }
  }, initialValue)
}

const createCharacterMetadataOfLength = (
  metadata: CharacterMetadataConfig | undefined,
  length: number,
): CharacterMetadata[] => createArrayOfRange((i) => CharacterMetadata.create(metadata), length)

const createRemarkBlock = (
  scriptLine: ScriptLineRemark,
  rolesEntityKeys: RolesEntityKeys,
  key: string,
): ContentBlock => {
  const roleEntityKey = rolesEntityKeys[scriptLine.role]
  const roleText = scriptLine.role
  const restText = scriptLineHandling.lineRemarkRoleSeparator + scriptLine.text
  const roleCharactersMetadata = createCharacterMetadataOfLength(
    {
      entity: roleEntityKey,
    },
    roleText.length,
  )
  const restCharactersMetadata = createCharacterMetadataOfLength(undefined, restText.length)

  const contentBlock = new ContentBlock({
    key: key,
    type: "paragraph",
    text: roleText + restText,
    characterList: List<CharacterMetadata>([...roleCharactersMetadata, ...restCharactersMetadata]),
    data: Map({
      scriptLineType: ScriptLineType.REMARK,
    }),
  })

  return contentBlock
}

const createActionBlock = (scriptLine: ScriptLineAction, key: string): ContentBlock => {
  return new ContentBlock({
    key: key,
    type: "paragraph",
    text: scriptLine.text,
    data: Map({
      scriptLineType: ScriptLineType.ACTION,
    }),
  })
}

const createCommentBlock = (scriptLine: ScriptLineComment, key: string): ContentBlock => {
  return new ContentBlock({
    key: key,
    type: "paragraph",
    text: scriptLine.text,
    data: Map({
      scriptLineType: ScriptLineType.COMMENT,
    }),
  })
}

export const createScriptLineBlock = (
  scriptLine: ScriptLine,
  rolesEntityKeys: RolesEntityKeys,
  key: string,
): ContentBlock => {
  switch (scriptLine.type) {
    case ScriptLineType.REMARK:
      return createRemarkBlock(scriptLine, rolesEntityKeys, key)
    case ScriptLineType.ACTION:
      return createActionBlock(scriptLine, key)
    case ScriptLineType.COMMENT:
      return createCommentBlock(scriptLine, key)
    default:
      return new ContentBlock()
  }
}

export const createScriptLinesBlocks = (
  scriptLines: ScriptLine[],
  rolesEntityKeys: RolesEntityKeys,
): ContentBlock[] => {
  const scriptContentBlockArray: ContentBlock[] = scriptLines.map(
    (line): ContentBlock => {
      return createScriptLineBlock(line, rolesEntityKeys, genKey())
    },
  )
  return scriptContentBlockArray
}

const getScriptLineType = (contentBlock: ContentBlock): ScriptLineType =>
  contentBlock.getData().get("scriptLineType") as ScriptLineType

const roleDecorator: DraftDecorator = {
  strategy: (contentBlock, callback, contentState) => {
    if (getScriptLineType(contentBlock) !== ScriptLineType.REMARK) {
      return
    }

    contentBlock.findEntityRanges((charMetadata) => {
      const entityKey = charMetadata.getEntity()
      if (entityKey) {
        const entityType = contentState.getEntity(entityKey).getType()
        return entityType === "ROLE"
      } else {
        return false
      }
    }, callback)
  },
  component: InlineRole,
}

const compositDecorator = new CompositeDecorator([roleDecorator])

export const createEditorStateFromScript = (
  script: Script,
  rolesColors: Record<RoleType, string>,
): [EditorState, RolesEntityKeys] => {
  const { contentState: contentStateWithRoleEntities, roleEntityKeys } = createRoleEntities(
    script.rolesMeta,
    new ContentState(),
    rolesColors,
  )
  const contentBlocks = createScriptLinesBlocks(script.lines, roleEntityKeys)

  const editorStateWithContent = EditorState.createWithContent(
    ContentState.createFromBlockArray(contentBlocks, contentStateWithRoleEntities.getEntityMap()),
    compositDecorator,
  )
  return [editorStateWithContent, roleEntityKeys]
}

const getContentBlockScriptLineType = (contentBlock: ContentBlock): ScriptLineType | undefined => {
  const blockData: Map<any, any> = contentBlock.getData()
  const blockLineType = blockData.get("scriptLineType") as ScriptLineType | undefined
  return blockLineType
}

const setContentBlockScriptLineType = (
  contentState: ContentState,
  contentBlockKey: string,
  lineType: ScriptLineType,
): ContentState => {
  return Modifier.setBlockData(
    contentState,
    new SelectionState({
      anchorKey: contentBlockKey,
      anchorOffset: 0,
      focusKey: contentBlockKey,
      focusOffset: 0,
    }),
    Map({
      scriptLineType: lineType,
    }),
  )
}

export const updateContentBlockEntities = (
  editorState: EditorState,
  rolesEntityKeys: RolesEntityKeys,
): EditorState => {
  console.log("last change type", editorState.getLastChangeType())
  if (
    [
      EditorChangeType.insertCharacters,
      EditorChangeType.backspaceCharacter,
      EditorChangeType.deleteCharacters,
      EditorChangeType.splitBlock,
    ].includes(editorState.getLastChangeType() as EditorChangeType)
  ) {
    const existingRoles: RoleType[] = Object.keys(rolesEntityKeys)
    const currContentState = editorState.getCurrentContent()
    const selection: SelectionState = editorState.getSelection()
    const currContentBlockKey = selection.getAnchorKey()
    const currContentBlock = currContentState.getBlockForKey(currContentBlockKey)

    const blockExistingScriptType = getContentBlockScriptLineType(currContentBlock)
    const currBlockText = currContentBlock.getText()
    const blockShouldBeScriptType = scriptLineHandling.checkLineTypeOfRawText(
      currBlockText,
      existingRoles,
    )

    // const newContentState = setContentBlockScriptLineType(
    //   currContentState,
    //   currContentBlockKey,
    //   blockShouldBeScriptType,
    // )
    const newContentState = Modifier.setBlockData(
      currContentState,
      selection,
      Map({
        scriptLineType: blockShouldBeScriptType,
      }),
    )
    console.log(
      newContentState
        .getBlocksAsArray()
        .map((block) => [block.getKey(), block.getData().get("scriptLineType")]),
    )

    return EditorState.push(editorState, newContentState, EditorChangeType.changeBlockData)
    //
    // console.log(
    //   "Edited block number: ",
    //   currContentState.getBlocksAsArray().indexOf(currContentBlock),
    // )
    // console.log("selection", selection)
    //
    // if (blockExistingScriptType === blockShouldBeScriptType) {
    //   return editorState
    // }
    // const blockAsScriptLine = scriptLineHandling.lineFromRawText(currBlockText, existingRoles)
    // const replaceWithContentBlock = createScriptLineBlock(
    //   blockAsScriptLine,
    //   rolesEntityKeys,
    //   genKey(),
    // )
    // const newContentBlocks = currContentState
    //   .getBlocksAsArray()
    //   .map((contentBlock) =>
    //     contentBlock.getKey() === currContentBlockKey ? replaceWithContentBlock : contentBlock,
    //   )
    // console.log(newContentBlocks)
    // const newContentState = ContentState.createFromBlockArray(newContentBlocks)
    //
    // const newEditorState = EditorState.push(
    //   editorState,
    //   newContentState,
    //   EditorChangeType.changeBlockData,
    // )
    // // const newEditorStateWithSelection = EditorState.forceSelection(
    // //   newEditorState,
    // //   new SelectionState({
    // //     anchorKey: selection.getAnchorKey(),
    // //     anchorOffset: selection.getAnchorOffset(),
    // //   }),
    // // )
    // return newEditorStateWithSelection
  }
  return editorState
}
