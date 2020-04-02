import { Project, Script, ScriptType } from "./dataTypes"
import { getBaseUrl, getUrl } from "./devOps"
import { post, put } from "./network"
import axios from "axios"
// import fs from "fs"
// import path from "path"
//
// const loadScript = (relFilepath: string): Script => {
//   const filepath = path.join(__dirname, relFilepath)
//   const script = fs.readFileSync(filepath, "utf8")
//   return JSON.parse(script)
// }

const scriptTypes: ScriptType[] = ["SKETCH", "SONG"]

export const SCRIPT_LINE_TYPE_REMARK = "REMARK"
export const SCRIPT_LINE_TYPE_ACTION = "ACTION"

// const fetchExampleScripts = async (): Promise<Script[]> =>
//   fetch("/example_scripts/all.json").then((res) => res.json())

const fetchAllProjects = async (): Promise<Project[]> => {
  let url: RequestInfo = getBaseUrl() + "/api/project/"
  return fetch(url).then((res) => res.json())
}

export const getProjects = (): Promise<Project[]> => {
  return fetchAllProjects()
    .then((projects: Project[]) => {
      console.log(projects)
      return projects
    })
    .catch((err) => {
      console.log("Got an error. TA DEG SAMMEN")
      console.debug("NÅ BLIR DET KAKTUS I POSTEN")
      return []
    })
}

const fetchProject = (projectId: string): Promise<any> => {
  return axios.get(getUrl(`/api/project/${projectId}`))
}

export const getProjectById = (projectId: string): Promise<Project> => {
  return fetchProject(projectId).then((r) => {
    console.log(r)
    return r.data
  })
}

export const createProject = (name: string, description: string): Promise<any> => {
  return post("/api/project/", { name, description })
}

export const createScript = (
  projectId: string,
  name: string,
  description: string,
  typeId: string,
): Promise<any> => {
  return post(`/api/project/${projectId}/script/`, { name, description, typeId: typeId })
}

export const changeScriptName = (projectId: string, scriptId: string, name: string) => {
  return put(`/api/project/${projectId}/script/${scriptId}/name/`, { name })
}

// export const getTestProjects = (): Promise<Project[]> => {
//   return fetchExampleScripts()
//     .then((scripts: Script[]) => {
//       console.log("scripts:", scripts)
//       return scripts
//     })
//     .then((scripts) => {
//       const projectsData: Project[] = [
//         {
//           id: "0",
//           title: "Push Pop Baluba",
//           description: "Første Abakusrevy!",
//           scripts: [...scripts],
//         },
//         {
//           id: "1",
//           title: "Solidarisk",
//           description: "Nazi revy",
//           scripts: [...scripts],
//         },
//         {
//           id: "2",
//           title: "Kult!",
//           description: "Den var kul ass",
//           scripts: [...scripts],
//         },
//         {
//           id: "3",
//           title: "Satte Spor",
//           description: "Blessed by dusken. Blessed by the lazer",
//           scripts: [...scripts],
//         },
//       ]
//       return projectsData
//     })
//     .catch((err) => {
//       console.error("Error", err)
//       return []
//     })
// }
