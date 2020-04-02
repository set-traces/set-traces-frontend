import { getTestProjects } from "./testData"
import { Project } from "./dataTypes"
import { getProjects, getProjectById, changeScriptName, updateDescription } from "./data"

export const fetchProjects = (): Promise<Project[]> => getProjects()

export const fetchProjectById = (projectId: string): Promise<Project> => getProjectById(projectId)

export const saveScriptName = (projectId: string, scriptId: string, name: string) =>
  changeScriptName(projectId, scriptId, name)

export const saveScriptDescription = (projectId: string, scriptId: string, description: string) =>
  updateDescription(projectId, scriptId, description)