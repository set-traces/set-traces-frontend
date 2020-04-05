import { DraftDecoratorComponentProps } from "./missingDraftTypes"
import React from "react"
import {
  getScriptLineBlockData,
  getScriptMetaEntityData,
  ScriptMetaEntityData,
} from "./customDraftUtils"
import { ScriptLine, ScriptLineType } from "../../../api/dataTypes"
import { DraftDecorator, CompositeDecorator } from "draft-js"

export type ScriptLineDecorator = {
  scriptLineType: ScriptLineType
  strategy: (
    scriptLine: ScriptLine,
    rawText: string,
    callback: (start: number, end: number) => void,
  ) => void
  scriptLineDecoratorComp: React.FC<ScriptLineDecoratorCompProps>
}

export type ScriptLineDecoratorCompProps = {
  scriptLine: ScriptLine
  scriptMeta: ScriptMetaEntityData
  rawText: string
}

export const createScriptLineCompositeDecorator = (
  scriptLineDecorators: ScriptLineDecorator[],
  scriptMetaEntityKey: string,
): CompositeDecorator => {
  const draftDecorators = scriptLineDecorators.map((scriptLineDecorator) =>
    createScriptLineDecorator(scriptLineDecorator, scriptMetaEntityKey),
  )
  return new CompositeDecorator(draftDecorators)
}

type DecoratorCompWrapperProps = { scriptMetaEntityKey: string } & DraftDecoratorComponentProps

const withScriptData = (
  Comp: React.FC<ScriptLineDecoratorCompProps>,
): React.FC<DecoratorCompWrapperProps> => {
  return ({ contentState, blockKey, scriptMetaEntityKey, children }) => {
    const contentBlock = contentState.getBlockForKey(blockKey)
    const rawText = contentBlock.getText()
    const scriptLine = getScriptLineBlockData(contentBlock).scriptLine
    const scriptMeta = getScriptMetaEntityData(contentState, scriptMetaEntityKey)
    return (
      <Comp scriptLine={scriptLine} scriptMeta={scriptMeta} rawText={rawText}>
        {children}
      </Comp>
    )
  }
}

const createScriptLineDecorator = (
  scriptLineDecorator: ScriptLineDecorator,
  scriptMetaEntityKey: string,
): DraftDecorator => {
  return {
    strategy: (contentBlock, callback, contentState) => {
      const scriptLine = getScriptLineBlockData(contentBlock).scriptLine
      if (scriptLine && scriptLine.type === scriptLineDecorator.scriptLineType) {
        scriptLineDecorator.strategy(scriptLine, contentBlock.getText(), callback)
      }
    },
    component: withScriptData(scriptLineDecorator.scriptLineDecoratorComp),
    props: {
      scriptMetaEntityKey,
    },
  }
}
