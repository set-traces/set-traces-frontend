
export const getUrl = (extension: string): string => {
    const base = getBaseUrl()
    return `${base}${extension}`
}

export const getBaseUrl = (): string => {
    const protocol: string = getProtocol();
    const backend: string = getBackend();
    return `${protocol}${backend}`
}

export const getProtocol = (): string => {
    if (process.env.NODE_ENV === "production") return "https://"
    let protocolOptionsstring: any = process.env.REACT_APP_DEFAULT_PROTOCOL_OPTIONS
    let defProt: string = ""
    if (protocolOptionsstring !== undefined) {
        let returnBackend: number = 0
        let userDefinedBackend: any = localStorage.getItem("backendUrl")
        if (userDefinedBackend !== null) returnBackend = userDefinedBackend
        let protoColOptions: string[] = protocolOptionsstring.split(" ")
        defProt = protoColOptions[returnBackend]
    } else {
        defProt = "https://"
    }
    
    let userDefinedProtocol: any = localStorage.getItem('protocol')
    if (userDefinedProtocol === null) return defProt
    return userDefinedProtocol
}

export const getBackend = (): string => {
    let defBack: string = "backend.settraces.com"
    if (process.env.NODE_ENV === "production") {
        let def = process.env.CENTRAL_BACKEND
        console.error(def)
        if (def !== undefined) return def
        return defBack
    }
    let backendOptionsstring: any = process.env.REACT_APP_BACKEND_OPTIONS
    if (backendOptionsstring === undefined) return defBack
    let backendOptions: string[] = backendOptionsstring.split(" ")
    let userDefinedBackend: any = localStorage.getItem("backendUrl")
    let returnBackend: number = 0
    if (userDefinedBackend !== null) returnBackend = userDefinedBackend
    return backendOptions[returnBackend]
}

export const setBackend = (numb: number) => {
    localStorage.clear();
    localStorage.setItem("backendUrl", numb.toString());
}

export const setProtocol = (protocol: string) => {
    localStorage.setItem("protocol", protocol)
}

