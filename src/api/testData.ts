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

export const getTestProjects = (): Promise<Project[]> => {
  return fetch("/SexToyStory.json")
    .then((res) => res.json())
    .then((scriptSexToyStory) => {
      const scetchIds = ["1", "2", "3"]
      const projectsData: Project[] = [
        {
          id: "0",
          title: "Push Pop Baluba",
          description: "Første Abakusrevy!",
          scripts: scetchIds.map((id) => ({ ...scriptSexToyStory, id: id })),
        },
        {
          id: "1",
          title: "Solidarisk",
          description: "Nazi revy",
          scripts: scetchIds.map((id) => ({ ...scriptSexToyStory, id: id })),
        },
        {
          id: "2",
          title: "Kult!",
          description: "Den var kul ass",
          scripts: scetchIds.map((id) => ({ ...scriptSexToyStory, id: id })),
        },
        {
          id: "3",
          title: "Satte Spor",
          description: "Blessed by dusken. Blessed by the lazer",
          scripts: scetchIds.map((id) => ({ ...scriptSexToyStory, id: id })),
        },
      ]
      return projectsData
    })
}
