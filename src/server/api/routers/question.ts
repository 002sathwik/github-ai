import { saveAnswerZ } from "~/zod/questionZ";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from '~/server/db';

export const questionRouter = createTRPCRouter({


    saveAnswer: protectedProcedure.input(saveAnswerZ).mutation(async ({ ctx, input }) => {

        return await ctx.db.question.create({
            data: {
                projectId: input.projectId,
                question: input.question,
                answer: input.answer,
                fileReferences: input.fileReferences,
                userId: ctx.user.userId!
            }
        })

    })
})