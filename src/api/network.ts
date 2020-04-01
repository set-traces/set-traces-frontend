import { getUrl } from "./devOps"
import axios from 'axios'


export const post = (extension: string, data: any): Promise<any> => {
    return axios.post(getUrl(extension), data)
}