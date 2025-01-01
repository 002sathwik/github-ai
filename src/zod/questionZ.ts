import * as z from 'zod';



const saveAnswerZ = z.object({
    projectId:z.string(),
    question: z.string(),
    answer: z.string(),
    fileReferences : z.any(),
})


export {saveAnswerZ}