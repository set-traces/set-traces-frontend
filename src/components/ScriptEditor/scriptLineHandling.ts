import { Role as RoleType, ScriptLine, ScriptLineType } from "../../api/dataTypes"

export const lineActionPrefix = "*"
export const lineRemarkRoleSeparator = ":"

export const checkLineTypeOfRawText = (
  lineText: string,
  existingRoles: RoleType[],
): ScriptLineType => {
  if (lineText.startsWith(lineActionPrefix)) {
    return ScriptLineType.ACTION
  }
  // check if a role is present
  if (lineText.includes(lineRemarkRoleSeparator)) {
    const [lineRole, restText] = lineText.split(lineRemarkRoleSeparator, 2)
    if (existingRoles.includes(lineRole)) {
      return ScriptLineType.REMARK
    }
  }
  return ScriptLineType.COMMENT
}

export const lineFromRawText = (rawText: string, existingRoles: RoleType[]): ScriptLine => {
  const lineType = checkLineTypeOfRawText(rawText, existingRoles)
  switch (lineType) {
    case ScriptLineType.REMARK:
      const [lineRole, restText] = rawText.split(lineRemarkRoleSeparator, 2)
      return {
        type: ScriptLineType.REMARK,
        role: lineRole,
        text: restText,
      }
    case ScriptLineType.ACTION:
      return {
        type: ScriptLineType.ACTION,
        roles: [],
        text: rawText.slice(lineActionPrefix.length),
      }
    case ScriptLineType.COMMENT:
      return {
        type: ScriptLineType.COMMENT,
        text: rawText,
      }
  }
}

export const remarkRoleRawTextRange = (rawText: string): [number, number] => {
  return [0, rawText.indexOf(lineRemarkRoleSeparator)]
}
