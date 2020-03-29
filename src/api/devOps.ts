
export const getBaseUrl = (): String => {

    console.log(process.env.NODE_ENV);

    const protocol: String = getProtocol();
    const backend: String = getBackend();
    console.log(backend)
    console.log(protocol)
    return "http://localhost:8080"
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
        console.log("setting default protocol from .env")
        defProt = protoColOptions[returnBackend]
    } else {
        console.log("setting hard coded protocol")
        defProt = "https://"
    }
    
    let userDefinedProtocol: any = localStorage.getItem('protocol')
    if (userDefinedProtocol === null) return defProt
    console.log("returning the consen protocol");
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