import { getTestProjects } from "./testData"
import { Project } from "./dataTypes"

export const fetchProjects = (): Promise<Project[]> => getTestProjects()
