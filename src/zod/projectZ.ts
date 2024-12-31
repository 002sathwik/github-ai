import * as z from 'zod';


const createProject = z.object({
    name: z.string(),
    githubUrl: z.string(),
    githubToken: z.string().optional(),
});

const getAllCommits = z.object({
    projectId: z.string(),
});

export { createProject , getAllCommits };