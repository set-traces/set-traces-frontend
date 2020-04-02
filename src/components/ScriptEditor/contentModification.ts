import {
  Role as RoleType,
  RoleMeta,
  Script,
  ScriptLine,
  ScriptLineAction,
  ScriptLineComment,
  ScriptLineRemark,
  ScriptLineType,
} from "../../api/dataTypes"
import {
  CharacterMetadata,
  CompositeDecorator,
  ContentBlock,
  ContentState,
  DraftDecorator,
  EditorState,
  genKey,
} from "draft-js"
import { createArrayOfRange } from "../../utils/arrayUtils"
import { CharacterMetadataConfig } from "./missingDraftTypes"
import { EditorChangeType } from "./missingDraftEnums"
import { List } from "immutable"
import { InlineRole, Role } from "./elements"

type RolesEntityKeys = Record<RoleType, string>

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
): ContentBlock => {
  const roleEntityKey = rolesEntityKeys[scriptLine.role]
  const roleText = scriptLine.role
  const restText = ": " + scriptLine.text
  const roleCharactersMetadata = createCharacterMetadataOfLength(
    {
      entity: roleEntityKey,
    },
    roleText.length,
  )
  const restCharactersMetadata = createCharacterMetadataOfLength(undefined, restText.length)

  const contentBlock = new ContentBlock({
    key: genKey(),
    type: "paragraph",
    text: roleText + restText,
    characterList: List<CharacterMetadata>([...roleCharactersMetadata, ...restCharactersMetadata]),
  })

  console.log(contentBlock)

  return contentBlock
}

const createActionBlock = (scriptLine: ScriptLineAction): ContentBlock => {
  return new ContentBlock({
    key: genKey(),
    type: "paragraph",
    text: scriptLine.text,
  })
}

const createCommentBlock = (scriptLine: ScriptLineComment): ContentBlock => {
  return new ContentBlock({
    key: genKey(),
    type: "paragraph",
    text: scriptLine.text,
  })
}

export const createScriptLinesBlocks = (
  scriptLines: ScriptLine[],
  rolesEntityKeys: RolesEntityKeys,
): ContentBlock[] => {
  const scriptContentBlockArray: ContentBlock[] = scriptLines.map(
    (line): ContentBlock => {
      switch (line.type) {
        case ScriptLineType.REMARK:
          return createRemarkBlock(line, rolesEntityKeys)
        case ScriptLineType.ACTION:
          return createActionBlock(line)
        case ScriptLineType.COMMENT:
          return createCommentBlock(line)
        default:
          return new ContentBlock()
      }
    },
  )
  return scriptContentBlockArray
}

const roleDecorator: DraftDecorator = {
  strategy: (contentBlock, callback, contentState) => {
    const text = contentBlock.getText()

    if (text.includes(":")) {
      callback(0, text.indexOf(":"))
    }
  },
  component: InlineRole,
}

const compositDecorator = new CompositeDecorator([roleDecorator])

export const createEditorStateFromScript = (
  script: Script,
  rolesColors: Record<RoleType, string>,
): EditorState => {
  const emptyEditorState = EditorState.createEmpty(compositDecorator)
  const { contentState: editorStateWithRoleEntities, roleEntityKeys } = createRoleEntities(
    script.rolesMeta,
    emptyEditorState.getCurrentContent(),
    rolesColors,
  )
  const contentBlocks = createScriptLinesBlocks(script.lines, roleEntityKeys)
  const a = EditorState.push(
    emptyEditorState,
    editorStateWithRoleEntities,
    EditorChangeType.insertCharacters,
  )
  return EditorState.push(
    a,
    ContentState.createFromBlockArray(contentBlocks),
    EditorChangeType.insertCharacters,
  )
}
