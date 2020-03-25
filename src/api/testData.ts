import { Project, Script, ScriptType } from "./dataTypes"
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

const fetchExampleScripts = async (): Promise<Script[]> =>
  fetch("/example_scripts/all.json").then((res) => res.json())

export const getTestProjects = (): Promise<Project[]> => {
  return fetchExampleScripts()
    .then((scripts) => {
      const projectsData: Project[] = [
        {
          id: "0",
          title: "Push Pop Baluba",
          description: "Første Abakusrevy!",
          scripts: [...scripts],
        },
        {
          id: "1",
          title: "Solidarisk",
          description: "Nazi revy",
          scripts: [...scripts],
        },
        {
          id: "2",
          title: "Kult!",
          description: "Den var kul ass",
          scripts: [...scripts],
        },
        {
          id: "3",
          title: "Satte Spor",
          description: "Blessed by dusken. Blessed by the lazer",
          scripts: [...scripts],
        },
      ]
      return projectsData
    })
    .catch((err) => {
      console.error("Error", err)
      return []
    })
}
