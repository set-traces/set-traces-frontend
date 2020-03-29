
export const getBaseUrl = (): String => {
    const protocol: String = getProtocol();
    const backend: String = getBackend();
    return `${protocol}${backend}`
}

const getProtocol = (): String => {
    if (process.env.NODE_ENV === "production") return "https://"
    let protocolOptionsString: any = process.env.REACT_APP_DEFAULT_PROTOCOL_OPTIONS
    let defProt: String = ""
    if (protocolOptionsString !== undefined) {
        let returnBackend: number = 0
        let userDefinedBackend: any = localStorage.getItem("backendUrl")
        if (userDefinedBackend !== null) returnBackend = userDefinedBackend
        let protoColOptions: String[] = protocolOptionsString.split(" ")
        defProt = protoColOptions[returnBackend]
    } else {
        defProt = "https://"
    }
    
    let userDefinedProtocol: any = localStorage.getItem('protocol')
    if (userDefinedProtocol === null) return defProt
    return userDefinedProtocol
}

const getBackend = (): String => {
    let defBack: String = "backend.settraces.com"
    if (process.env.NODE_ENV === "production") {
        let def = process.env.CENTRAL_BACKEND
        console.error(def)
        if (def !== undefined) return def
        return defBack
    }
    let backendOptionsString: any = process.env.REACT_APP_BACKEND_OPTIONS
    if (backendOptionsString === undefined) return defBack
    let backendOptions: String[] = backendOptionsString.split(" ")
    let userDefinedBackend: any = localStorage.getItem("backendUrl")
    let returnBackend: number = 0
    if (userDefinedBackend !== null) returnBackend = userDefinedBackend
    return backendOptions[returnBackend]
}