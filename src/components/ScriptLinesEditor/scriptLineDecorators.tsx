import { CompositeDecorator } from "draft-js"
import { ScriptLineRemark, ScriptLineType } from "../../api/dataTypes"
import styled from "styled-components"
import React from "react"
import {
  createScriptLineCompositeDecorator,
  ScriptLineDecorator,
  ScriptLineDecoratorCompProps,
} from "./customDraft/customDraftDecoratorUtils"

const RoleDecoratorComp = styled.span<ScriptLineDecoratorCompProps>`
  background-color: ${({ scriptLine, scriptMeta, rawText }) => {
    const color = scriptMeta.rolesColors[(scriptLine as ScriptLineRemark).role]
    return color
  }};
  padding: 2px;
  border-radius: 3px;
`

const remarkRoleLineDecorator: ScriptLineDecorator = {
  scriptLineType: ScriptLineType.REMARK,
  strategy: (scriptLine, rawText, callback) => {
    callback(0, (scriptLine as ScriptLineRemark).role.length)
  },
  scriptLineDecoratorComp: RoleDecoratorComp,
}

const CommentLineDecoratorComp = styled.span<ScriptLineDecoratorCompProps>`
  color: #000000b3;
`

const commentLineDecorator: ScriptLineDecorator = {
  scriptLineType: ScriptLineType.COMMENT,
  strategy: (scriptLine, rawText, callback) => {
    callback(0, rawText.length)
  },
  scriptLineDecoratorComp: CommentLineDecoratorComp,
}

const ActionLineDecoratorComp = styled.span<ScriptLineDecoratorCompProps>`
  background-color: #00000023;
  border-radius: 2px;
  padding: 1px;
`

const actionLineDecorator: ScriptLineDecorator = {
  scriptLineType: ScriptLineType.ACTION,
  strategy: (scriptLine, rawText, callback) => {
    callback(0, rawText.length)
  },
  scriptLineDecoratorComp: ActionLineDecoratorComp,
}

export const createScriptLineDecorators = (scriptMetaEntityKey: string): CompositeDecorator =>
  createScriptLineCompositeDecorator(
    [remarkRoleLineDecorator, actionLineDecorator, commentLineDecorator],
    scriptMetaEntityKey,
  )
