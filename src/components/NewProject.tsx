import React from "react";
import styled from "styled-components";
import Modal from "./Modal";
import {DangerButton, GreenButton} from './utils/LinkButton'

type Props = {
  className?: string
}

const Wrapper = styled.div`
  
`

const Title = styled.h3`
  
`

const Description = styled.div`

`


const NewProject: React.FC<Props> = ({className}) =>  {

  return (
    <Modal>
      New Project
      <div>
        <DangerButton to={'/'}>Lukk</DangerButton>
        <GreenButton to={'/projects'}>Lagre</GreenButton>
      </div>
    </Modal>
  )
}

export default NewProject