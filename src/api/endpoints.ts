import { getTestProjects } from "./testData"
import { Project } from "./dataTypes"
import { getProjects } from './data'

export const fetchProjects = (): Promise<Project[]> => getProjects()
