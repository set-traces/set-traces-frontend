import React, { useCallback, useState, MouseEvent } from "react"
import { Script } from "../api/dataTypes"
import styled from "styled-components"

type Props = {
  className?: string
  scripts: Script[]
  selectedScriptId?: string
  onClick?: (script: Script) => void
}

const List = styled.ol`
  list-style-type: none;
  margin: 0;
  padding: 0;
`

const Item = styled.li<{ highlight?: boolean }>`
  margin: 10px;
  padding: 10px;
  cursor: pointer;
  border-top: 1px solid ${(props) => props.theme.colors.dark}33;
  background-color: ${(props) => (props.highlight ? props.theme.colors.highlight : null)};

  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Name = styled.h3`
  margin: 0;
  color: ${(props) => props.theme.colors.undertone};
`
const Type = styled.div``

const ScriptList: React.FC<Props> = ({ className, scripts, selectedScriptId, onClick }) => {
  const handleClicked = useCallback(
    (e: MouseEvent, script: Script) => {
      if (onClick) {
        onClick(script)
      }
      e.stopPropagation()
    },
    [onClick],
  )

  return (
    <List className={className}>
      {scripts.map((script) => (
        <Item key={script.id} onClick={(e) => handleClicked(e, script)}>
          <div>
            <Name>
              {script.name.length < 30 ? script.name : `${script.name.substring(0, 27)}...`}
            </Name>
          </div>
          <Type>{script.type}</Type>
        </Item>
      ))}
    </List>
  )
}

export default ScriptList
