import { getUrl } from "./devOps"
import axios from 'axios'


export const post = (extension: string, data: any): Promise<any> => {
    return axios.post(getUrl(extension), data)
}

export const put = (extension: string, data: any): Promise<any> => {
    return axios.put(getUrl(extension), data)
}