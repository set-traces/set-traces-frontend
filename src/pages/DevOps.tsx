import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { setBackend, setProtocol, getBackend, getProtocol } from './../api/devOps'
import { RouteComponentProps, withRouter } from "react-router-dom"
import {getUrl} from './../api/devOps'

interface Props extends RouteComponentProps {
  
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 2em;
`

const Col = styled.div`
  width: 100%;
`

const PageRow = styled.div`
  flex: 1;
`

const ProjectsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const Header = styled.h3`
  color: red;
`

const Selection = styled.select`
  width: 300px;
`

const Backend = styled.div`
`

const DevOpsTitle = styled.h1`
  color: ${(props) => props.theme.colors.dark};
`

const Option = styled.option`
`

const Saved = styled.div`
  position: absolute;
  top: 16%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #2a882a;
  /* width: 400px; */
  /* height: 200px; */
  padding: 2em;
  border-radius: 5px;
  border: 2px solid #005d00;
  color: white;
  padding-left: 4em;
  padding-right: 4em;
`

const Message = styled.p``

const updateBackend = (inp: string, setter: any, setProt: any, saved: any) => {
  setter(inp)
  setBackend(parseInt(inp))
  setProt(getProtocol())
  saved()
}

const updateProtocols = (inp: string, setter: any, saved: any) => {
  setter(inp)
  setProtocol(inp)
  saved()
}


const DevOps: React.FC<Props> = ({ history }) => {
  //const [projects, setProjects] = useState<Project[]>([])


  const saved = () => {
    setOperational("loading...")
    setShowSaved(true)
    setTimeout(() => {
      setShowSaved(false)
    }, 1000)
    testBackend()
  }

  const testBackend = () => {
    fetch(getUrl('/api/version')).then((r: Response) => r.json()).then(r => setOperational("System fully operational")).catch(err => setOperational("System failed"))
  }

  const [backends, setBackends] = useState<string[]>([])
  const [protocols, setProcotols] = useState<string[]>([])

  const [operational, setOperational] = useState<string>("loading")

  const [showSaved, setShowSaved] = useState<boolean>(false)

  const [selectedBackend, setSelectedBackend] = useState<number>(0)
  const [selectedProtocol, setSelectedProtocol] = useState<string>('')

  useEffect(() => {
    //fetchProjects().then(setProjects)
    testBackend()
    setSelectedProtocol(getProtocol())
    
    const options: any = process.env.REACT_APP_BACKEND_OPTIONS
    if (options !== undefined) {
      let b: string[] = options.split(" ")
      let sel: number = 0
      let n = 0
      b.forEach((backend: string) => {
        if (backend === getBackend()) sel = n
        n++
      })
      setBackends(b)
      setSelectedBackend(sel)
    }
    //const prots: any = process.env.REACT_APP_DEFAULT_PROTOCOL_OPTIONS
    let b: string[] = "https:// http://".split(" ")
    setProcotols(b)
  }, [])

  let v: number = 0

  let backendOptions = backends.map((backend: string) => {
    return <Option key={v} value={v++}>{backend}</Option>
  })

  let protocolOptions = protocols.map((prot: string) => {
    return <Option key={prot} value={prot}>{prot}</Option>
  })

  return (
    <Wrapper>
      <Col>
        <DevOpsTitle>DevOps Tools</DevOpsTitle>
        <Backend>
          {showSaved ? <Saved><h3>Lagret</h3></Saved> : null}
          <Header>
            Velg backend
          </Header>
          <Selection onChange={(e: any) => {updateBackend(e.target.value, setSelectedBackend, setSelectedProtocol, saved)}} value={selectedBackend}>
            {backendOptions}
          </Selection>
          <Header>Velg protocol</Header>
          <Selection onChange={(e: any) => {updateProtocols(e.target.value, setSelectedProtocol, saved)}} value={selectedProtocol}>
            {protocolOptions}
          </Selection>
        </Backend>
      </Col>
      <Col>
        <DevOpsTitle>Health</DevOpsTitle>
        <Message>
          {operational}
        </Message>
      </Col>
    </Wrapper>
  )
}

export default withRouter(DevOps)
