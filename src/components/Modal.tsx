import React from 'react'
import styled from 'styled-components'


type Props = {
    visible?: boolean
}

const Wrapper = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: #000000bd;
`

const Inner = styled.div`
    position: absolute;
    box-sizing: border-box;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: fit-content;
    background-color: #2b2b2b;
    padding: 4em;
    border-radius: 5px;
    border: 1px solid black;
    box-shadow: 0px 4px 7px 0px #0000008c;
`

const Modal: React.FC<Props> = props => {
    return <Wrapper>
        <Inner>
            {props.children}
            
        </Inner>
    </Wrapper>
}

export default Modal