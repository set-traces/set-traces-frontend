import React, { useCallback, useState, MouseEvent } from "react"

import styled from "styled-components"

type Props = {
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

const Toolbar = styled.div`
    width: 100%;
    background: #333;
    padding: 1em;
    color: white;
`

const Name = styled.h3`
  margin: 0;
  color: ${(props) => props.theme.colors.undertone};
`
const Type = styled.div``

const DevOpsToolbar: React.FC<Props> = ({ }) => {
  

  return (
    <Toolbar>
        DevOps
    </Toolbar>
  )
}

export default DevOpsToolbar
