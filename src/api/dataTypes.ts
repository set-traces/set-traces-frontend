export type ScriptType = string
export type Role = string
export type Actor = string
export type RoleMeta = {
  role: Role
  description: string
  actor: Actor
}

export enum ScriptLineType {
  REMARK = "REMARK",
  ACTION = "ACTION",
  COMMENT = "COMMENT",
}

export type ScriptLineRemark = {
  type: typeof ScriptLineType.REMARK
  role: Role
  text: string
}

export type ScriptLineAction = {
  type: typeof ScriptLineType.ACTION
  roles: Role[]
  text: string
}

export type ScriptLineComment = {
  type: typeof ScriptLineType.COMMENT
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
