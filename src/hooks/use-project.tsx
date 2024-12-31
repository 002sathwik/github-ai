import React from 'react'
import { api } from '~/trpc/react'
import { useLocalStorage } from 'usehooks-ts'
const UseProject = () => {
    const { data: projects } = api.project.getAllProjects.useQuery()
    const [projectId, setProjectId] = useLocalStorage('projectId', 'string')
    const project = projects?.find(project => project.id === projectId)
    return {
        projects,
        projectId,
        setProjectId,
        project,
    }
}

export default UseProject
