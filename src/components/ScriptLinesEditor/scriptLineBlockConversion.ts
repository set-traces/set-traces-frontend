import {
  ScriptLine,
  ScriptLineAction,
  ScriptLineComment,
  ScriptLineRemark,
  ScriptLineType,
} from "../../api/dataTypes"
import { ContentBlock } from "draft-js"
import { lineRemarkRoleSeparator } from "./scriptLineHandling"
import { createScriptLineBlock } from "./customDraft/customDraftUtils"

const createRemarkBlock = (
  scriptLine: ScriptLineRemark,
  scriptMetaEntityKey: string,
  blockKey?: string,
): ContentBlock => {
  return createScriptLineBlock(
    scriptLine.role + lineRemarkRoleSeparator + scriptLine.text,
    {
      scriptLine,
      scriptMetaEntityKey,
    },
    blockKey,
  )
}

const createActionBlock = (
  scriptLine: ScriptLineAction,
  scriptMetaEntityKey: string,
  blockKey?: string,
): ContentBlock => {
  return createScriptLineBlock(
    scriptLine.text,
    {
      scriptLine,
      scriptMetaEntityKey,
    },
    blockKey,
  )
}

const createCommentBlock = (
  scriptLine: ScriptLineComment,
  scriptMetaEntityKey: string,
  blockKey?: string,
): ContentBlock => {
  return createScriptLineBlock(scriptLine.text, { scriptLine, scriptMetaEntityKey }, blockKey)
}

export const createBlockFromScriptLine = (
  scriptLine: ScriptLine,
  scriptMetaEntityKey?: string,
  blockKey?: string,
): ContentBlock => {
  const useScriptMetaEntityKey = scriptMetaEntityKey ? scriptMetaEntityKey : ""
  switch (scriptLine.type) {
    case ScriptLineType.REMARK:
      return createRemarkBlock(scriptLine, useScriptMetaEntityKey, blockKey)
    case ScriptLineType.ACTION:
      return createActionBlock(scriptLine, useScriptMetaEntityKey, blockKey)
    case ScriptLineType.COMMENT:
      return createCommentBlock(scriptLine, useScriptMetaEntityKey, blockKey)
  }
}

export const createBlocksFromScriptLines = (
  scriptLines: ScriptLine[],
  scriptMetaEntityKey?: string,
): ContentBlock[] => {
  const scriptContentBlockArray: ContentBlock[] = scriptLines.map(
    (line): ContentBlock => {
      return createBlockFromScriptLine(line, scriptMetaEntityKey)
    },
  )
  return scriptContentBlockArray
}
