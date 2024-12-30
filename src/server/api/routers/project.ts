import { createProject } from "~/zod/projectZ";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({

    createproject: protectedProcedure.input(createProject).mutation(async ({ ctx, input }) => {
        if (!ctx.user.userId) {
            throw new Error("User not found");
        }
        const project = await ctx.db.project.create({
            data: {
                name: input.name,
                githubUrl: input.githubUrl,
                githubToken: input.githubToken,
                userToProject: {
                    create: {
                        userId: ctx.user.userId,
                    }
                }
            }
        })
        return project

    })
})

