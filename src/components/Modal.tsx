import React from 'react'
import styled from 'styled-components'


type Props = {
    visible?: boolean
}

const Wrapper = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: #00000055;
`

const Inner = styled.div`
    position: absolute;
    box-sizing: border-box;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: fit-content;
    background-color: whitesmoke;
    padding: 4em;
    border-radius: 5px;
    border: 1px solid black;
`

const Modal: React.FC<Props> = props => {
    return <Wrapper>
        <Inner>
            {props.children}
            
        </Inner>
    </Wrapper>
}

export default Modal