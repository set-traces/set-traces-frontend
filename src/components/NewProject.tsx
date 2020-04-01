import React, { useState, useEffect, cloneElement, useRef } from "react"
import styled, { ThemeProps, keyframes } from "styled-components"
import Modal from "./Modal"
import { DangerButton } from "./utils/LinkButton"
import { GreenButton } from "./utils/ElementButton"
import { createProject } from "./../api/data"
import { Redirect } from "react-router-dom"
import {useInterval} from './utils/useInterval'

type Props = {
  className?: string
}

const Wrapper = styled.div``

const Title = styled.h3``

const Description = styled.div``

const Header = styled.h1`
  margin: 0;
  color: ${(props) => props.theme.colors.positive};
`

const LLabel = styled.label`
  font-weight: bold;
  font-size: 1.4em;
  text-transform: uppercase;
  color: ${(props) => props.theme.colors.negativeIsh};
`

const LabelWrapper = styled.div``

const IInput = styled.input`
  margin-top: 0.1em;
  margin-bottom: 0.5em;
  border-radius: 5px;
  padding: 0.5em;
  border: none;
  font-size: 1.1em;
  color: ${(props) => props.theme.colors.undertone};

  &::placeholder {
    color: ${(props) => props.theme.colors.undertone};
  }
`

const Label = (props: { children: React.ReactNode }) => {
  return (
    <LabelWrapper>
      <LLabel>{props.children}:</LLabel>
    </LabelWrapper>
  )
}

const InputWrapper = styled.div`
  margin: 2em 0 2em 0;
`

const Input = (props: {
  name: string
  type: string | undefined
  value: string | number | string[] | undefined
  onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined
  style: any
}) => {
  return (
    <InputWrapper style={props.style}>
      <Label>{props.name}</Label>
      <IInput
        type={props.type}
        style={props.style}
        placeholder={props.name}
        value={props.value}
        onChange={props.onChange}
      />
    </InputWrapper>
  )
}

const Loading = () => {
  const rotate360 = keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
`

  const LoadingWrapper = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  `
  const LoadingAnimation = styled.div`
    animation: ${rotate360} 1s linear infinite;
    transform: translateZ(0);
    border-top: 13px solid ${(props: any) => props.theme.colors.positive};
    border-right: 13px solid ${(props: any) => props.theme.colors.negative};
    border-bottom: 13px solid ${(props: any) => props.theme.colors.highlight};
    border-left: 13px solid ${(props: any) => props.theme.colors.negativeIsh};
    background: transparent;
    width: 85px;
    height: 85px;
    border-radius: 50%;
  `

  return (
    <div style={{ padding: "2em" }}>
      <LoadingWrapper>
        <LoadingAnimation></LoadingAnimation>
      </LoadingWrapper>
    </div>
  )
}

const ErrorBody = styled.div`
  text-align: center;
  font-weight: bold;
  color: white;
  font-size: 2em;
`

const StyledCountDown = styled.div<{ width: number }>`
  width: ${(props) => props.width}%;
  height: 2px;
  background: #fff;
  margin: auto;
  margin-top: 2em;
`

const CountDown = (props: any) => {
  return <StyledCountDown width={props.width} />
}



const Error = (props: any): any => {
  
  const [w, sw] = useState(100)
  
  useInterval(() => {
    sw(w-1)
  }, 15)
  console.log(w)
  if (props.showError) {
    return <div>
      <ErrorBody>Det skjedde en feil</ErrorBody>
      <CountDown width={w} />
    </div>
  }
  return null
}

const InnerModal = (props: any): any => {
  return (
    <div>
      <Header>New Project</Header>
      <div></div>
      <div>
        <Input
          type={"text"}
          name={"Name"}
          style={{}}
          value={props.name}
          onChange={(e) => {
            props.setName(e.target.value)
          }}
        />
        <Input
          type={"text"}
          name={"Description"}
          style={{ width: "100%", boxSizing: "border-box" }}
          value={props.desc}
          onChange={(e) => {
            props.setDesc(e.target.value)
          }}
        />
      </div>
      <div>
        <DangerButton to={"/"}>Lukk</DangerButton>
        <GreenButton onClick={props.create}>Lagre</GreenButton>
      </div>
    </div>
  )
}

const NewProject: React.FC<Props> = ({ className }) => {
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")

  const [isLoading, setLoading] = useState(false)
  const [isError, setError] = useState(false)
  const [redirectProject, setRedirectProject] = useState(null)

  const create = (e: any) => {
    createProject(name, desc)
      .then((r) => {
        if (r.status !== 200) {
          throw "error"
        }
        setRedirectProject(r.data.id)
        return r
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
        setError(true)
        setTimeout(() => {
          setError(false)
        }, 1500) // 2.5 seconds
      })
  }

  if (redirectProject !== null) {
    console.log("redirect")
    return <Redirect to={`/project/${redirectProject}`} />
  }

  return (
    <Modal>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <Error showError={isError} />
      ) : (
        <InnerModal
          key={"modal"}
          create={create}
          name={name}
          setName={setName}
          desc={desc}
          setDesc={setDesc}
        />
      )}
    </Modal>
  )
}

export default NewProject
