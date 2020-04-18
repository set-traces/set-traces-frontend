
import React from 'react'
import styled from 'styled-components'


let topAndBottomPadding: string = '.5em'

const Button = styled.button`
    position:relative;
    top: ${topAndBottomPadding};
    cursor: pointer;
    font-size: 1em;
    padding: 1em;
    padding-top: ${topAndBottomPadding};
    padding-bottom: ${topAndBottomPadding};
    color: white;
    text-decoration: none;
    border-radius: 5px;
    border: 1px solid;
    box-shadow: 0px 3px 16px 2px #00000042;
    &:hover {
        
    }
`


// const LinkButton: React.FC<Props> = (props: Props) => {
//     return <div style={{paddingTop: '2em'}}>
//         <Button className={props.className} to={props.to}>{props.children}</Button>
//     </div>
// }

export const DangerButton = styled(Button)`
    color: white;
    background-color: #d44040;
    border-color: #520000;

    &:hover {
        background-color: #520000;
        border-color: #520000;
        box-shadow: unset;
    }
`

export const GreenButton = styled(Button)`
    color: white;
    background-color: #689377;
    border-color: #005230;

    &:hover {
        background-color: #005230;
        border-color: #005230;
        box-shadow: unset;
    }
`