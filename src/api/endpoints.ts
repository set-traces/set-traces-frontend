import { getTestProjects } from "./testData"
import { Project } from "./dataTypes"
import { getProjects, getProjectById } from './data'

export const fetchProjects = (): Promise<Project[]> => getProjects()

export const fetchProjectById = (projectId: string): Promise<Project> => getProjectById(projectId)