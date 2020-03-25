import { SCRIPT_LINE_TYPE_ACTION, SCRIPT_LINE_TYPE_REMARK } from "./testData"

export type ScriptType = string
export type Role = string
export type Actor = string
export type RoleMeta = {
  role: Role
  description: string
  actor: Actor
}

export type ScriptLineRemark = {
  type: typeof SCRIPT_LINE_TYPE_REMARK
  role: Role
  text: string
}

export type ScriptLineAction = {
  type: typeof SCRIPT_LINE_TYPE_ACTION
  roles: Role[]
  text: string
}

export type ScriptLine = ScriptLineRemark | ScriptLineAction

export type Script = {
  id: string
  name: string
  type: ScriptType
  description: string
  rolesMeta: RoleMeta[]
  lines: ScriptLine[]
}

export type Project = {
  id: string
  name: string
  description: string
  scripts: Script[]
}
