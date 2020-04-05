import { CompositeDecorator, DraftDecorator } from "draft-js"
import { ScriptLineRemark, ScriptLineType } from "../../api/dataTypes"
import { getScriptLineBlockData, getScriptMetaEntityData } from "./customDraft/customDraftUtils"
import styled from "styled-components"
import { DraftDecoratorComponentProps } from "./customDraft/missingDraftTypes"

const RoleDecoratorComp = styled.span<
  { scriptMetaEntityKey: string } & DraftDecoratorComponentProps
>`
  background-color: ${({ contentState, blockKey, scriptMetaEntityKey }) => {
    const contentBlock = contentState.getBlockForKey(blockKey)
    const scriptLine = getScriptLineBlockData(contentBlock).scriptLine as ScriptLineRemark
    const scriptMeta = getScriptMetaEntityData(contentState, scriptMetaEntityKey)
    const color = scriptMeta.rolesColors[scriptLine.role]
    return color
  }};
  padding: 2px;
  border-radius: 3px;
`

const createRemarkDecorators = (scriptMetaEntityKey: string): DraftDecorator[] => {
  const remarkRoleDecorator: DraftDecorator = {
    strategy: (contentBlock, callback, contentState) => {
      const scriptLine = getScriptLineBlockData(contentBlock).scriptLine
      if (scriptLine && scriptLine.type === ScriptLineType.REMARK) {
        callback(0, scriptLine.role.length)
      }
    },
    component: RoleDecoratorComp,
    props: {
      scriptMetaEntityKey,
    },
  }
  return [remarkRoleDecorator]
}

export const createScriptLineDecorators = (scriptMetaEntityKey: string): CompositeDecorator =>
  new CompositeDecorator(createRemarkDecorators(scriptMetaEntityKey))
