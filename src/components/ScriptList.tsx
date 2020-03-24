import React, { useCallback, useState, MouseEvent } from "react"
import { Script } from "../api/dataTypes"
import styled from "styled-components"

type Props = {
  className?: string
  scripts: Script[]
  onViewClick?: (script: Script) => void
}

const List = styled.ol`
  list-style-type: none;
  margin: 0;
  padding: 0;
`

const Item = styled.li`
  margin: 10px;
  padding: 10px;
  background-color: #adadad;
`

const ItemHeaderCol = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const ViewButton = styled.button``

const Name = styled.h3`
  padding-right: 100px;
  margin: 0;
  color: ${(props) => props.theme.colors.highlight};
`
const Type = styled.div``

const Description = styled.p`
  color: ${(props) => props.theme.colors.dark};
`

const ScriptList: React.FC<Props> = ({ className, scripts, onViewClick }) => {
  const [expandedItemId, setExpandedItemId] = useState<string | undefined>(undefined)

  const handleViewClicked = useCallback(
    (e: MouseEvent, script: Script) => {
      if (onViewClick) {
        onViewClick(script)
      }
      e.stopPropagation()
    },
    [onViewClick],
  )

  return (
    <List className={className}>
      {scripts.map((script) => (
        <Item
          key={script.id}
          onClick={() =>
            expandedItemId === script.id
              ? setExpandedItemId(undefined)
              : setExpandedItemId(script.id)
          }
        >
          <ItemHeaderCol>
            <div>
              <Name>{script.name}</Name>
              <Type>{script.type}</Type>
            </div>
            <ViewButton onClick={(e) => handleViewClicked(e, script)}>View</ViewButton>
          </ItemHeaderCol>

          <Description hidden={expandedItemId !== script.id}>{script.description}</Description>
        </Item>
      ))}
    </List>
  )
}

export default ScriptList
