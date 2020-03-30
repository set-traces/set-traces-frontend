import React, { useCallback, useState, MouseEvent, useEffect } from "react"
import styled from "styled-components"

import {getUrl, setBackend} from './../api/devOps'

type Props = {
}

type backendOption = {
    component: any
}

type backendOptions = {
    [key: string]: backendOption;
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
    background: #333;
    padding: 1em;
    color: white;
    display: flex;
    position: relative;
`

const Header = styled.h2`
    margin: 0;
`

const Links = styled.div`
    display: flex;
    margin-left: 2em;
    vertical-align: middle;
`
const Link = styled.a`
    color: white;
    text-decoration: none;
    vertical-align: middle;
    margin: auto;
    margin-left: 1em;
`

const Divider = styled.div`
    margin: auto;
    vertical-align: middle;
    margin-left: 1em;
    font-weight: bold;
    font-size: 1em;
`

const Ingress = styled.div`
    margin-left: 2.6em;
    font-size: .6em;
`

const StatusWrapper = styled.div`
    position: absolute;
    top: 50%;
    right: 1em;
    transform: translateY(-50%);
`

const Name = styled.h3`
  margin: 0;
  color: ${(props) => props.theme.colors.undertone};
`

const BackendStatusComponent = (props: any) => {
    return <div style={{color: props.color}}>{props.children}</div>
}

const Type = styled.div``

const DevOpsToolbar: React.FC<Props> = ({}) => {

    const Status = (props: any) => {
        let options: backendOptions = {loading: {component: <BackendStatusComponent color={'yellow'}>Loading</BackendStatusComponent>}, 'online': {component: <BackendStatusComponent color={'green'}>Online</BackendStatusComponent>}, 'offline': {component: <BackendStatusComponent color={'red'}>Offline</BackendStatusComponent>}}
        return options[backendOnline].component
    }
    
    const Version = (props: any) => {
        return <div style={{textAlign: 'left'}}>
            <span>{backendVersion}</span>
        </div>
    }

    const Url = (props: any) => {
        return <div style={{marginTop: '-5px'}}>
            <span style={{fontSize: '.5em'}}>{getUrl('')}</span>
        </div>
    }

    const [backendOnline, setBackendOnline] = useState<string>("loading")
    const [backendVersion, setBackendVersion] = useState<string>("")
    

    const get = () => {
        fetch(getUrl('/api/version')).then(r => {
            if (r.status !== 200) {
                throw 'Backend not online'; 
            }
            return r
        }).then(r => r.json()).then(r => {
            setBackendOnline('online')
            setBackendVersion(r.version)
        }).catch(err => {
            setBackendOnline('offline')
        })
    }

    const getBackendData = useCallback(() => {
        get()
        setInterval(() => {
            get()
        }, 30000)
        
        
    }, [])

    useEffect(() => {
        console.log("Called use effect")
        getBackendData()
    }, [getBackendData])
    
    if (process.env.NODE_ENV === "production") return null

    
    return (
        <Toolbar>
            <div>
                <Header>
                    <Link href={'/devops'}>DevOps</Link>
                </Header>
                <Ingress>Development view</Ingress>
            </div>
            <Links>
                <Link target={'_blank'} href={'http://docs.settraces.com'}>API Docs</Link>
                <Divider>|</Divider>
                <Link href={'/'}>Home</Link>
            </Links>
            <StatusWrapper>
                <Status />
                <Version />
                <Url />
            </StatusWrapper>
        </Toolbar>
    )
}

export default DevOpsToolbar
