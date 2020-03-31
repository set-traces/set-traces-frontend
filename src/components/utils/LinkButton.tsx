import React, { ReactElement } from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'

type buttonStyle = {
    color: string,
    borderColor: string
}

type btnTypes = {
    [key: string]: buttonStyle
}

type Props = {
    className?: any,
    to: string,
    children?: string
    type: string
}

const buttonStyleOptions: btnTypes = {
    'danger': {
        color: 'red',
        borderColor: 'green'
    }
}

let buttonStyles = {
    'danger-button': {
        color: 'yellow',
        borderColor: 'green'
    }
}

let topAndBottomPadding: string = '.5em'

const Button = styled(Link)`
    position:relative;
    top: ${topAndBottomPadding};
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
    background-color: #009047;
    border-color: #005230;

    &:hover {
        background-color: #005230;
        border-color: #005230;
        box-shadow: unset;
    }
`