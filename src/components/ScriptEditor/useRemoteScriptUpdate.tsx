import { EditableScriptLinesState } from "../ScriptLinesEditor/editableScriptLinesState"
import { useEffect, useState } from "react"
import { ScriptLineDelta, ScriptLineDeltaType } from "../ScriptLinesEditor"
import { ScriptLine, ScriptLineType } from "../../api/dataTypes"
import { useInterval } from "../../hooks/timing"

const characters = "    abcdefghijklmnopqrstuvwxyz0123456789"

export default (
  scriptLinesState: EditableScriptLinesState | undefined,
  onUpdatedScriptLines: (scriptLinesState: EditableScriptLinesState) => void,
) => {
  const [remoteLineUpdates, setRemoteLineUpdates] = useState<ScriptLineDelta[]>([])
  const [editLineIndex, setEditLineIndex] = useState<number>(0)

  useInterval(() => {
    if (scriptLinesState) {
      setEditLineIndex(Math.floor(Math.random() * scriptLinesState.getLinesCount()))
    }
  }, 4000)
  useInterval(() => {
    if (scriptLinesState) {
      const existingLine = scriptLinesState.getAllLines()[editLineIndex]
      const existingText = existingLine.text
      const newText =
        existingText + characters.charAt(Math.floor(Math.random() * characters.length))
      let modifiedLine: ScriptLine
      switch (existingLine.type) {
        case ScriptLineType.COMMENT:
          modifiedLine = {
            type: ScriptLineType.COMMENT,
            text: newText,
          }
          break
        case ScriptLineType.ACTION:
          modifiedLine = {
            type: ScriptLineType.ACTION,
            text: newText,
            roles: [],
          }
          break
        case ScriptLineType.REMARK:
          modifiedLine = {
            type: ScriptLineType.REMARK,
            text: newText,
            role: existingLine.role,
          }
          break
      }

      const lineUpdates: ScriptLineDelta[] = [
        {
          type: ScriptLineDeltaType.MODIFY,
          scriptLine: modifiedLine,
          lineIndex: editLineIndex,
        },
      ]
      setRemoteLineUpdates([...remoteLineUpdates, ...lineUpdates])
    }
  }, 100)

  useEffect(() => {
    if (scriptLinesState && remoteLineUpdates.length > 0) {
      remoteLineUpdates.forEach((delta) => {
        switch (delta.type) {
          case ScriptLineDeltaType.MODIFY:
            const modifiedState = scriptLinesState.modifyScriptLine(
              delta.scriptLine,
              delta.lineIndex,
            )
            onUpdatedScriptLines(modifiedState)
            setRemoteLineUpdates([])
            break
          default:
        }
      })
    }
  }, [remoteLineUpdates, onUpdatedScriptLines])
}
