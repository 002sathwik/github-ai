import { createProject, getAllCommits } from "~/zod/projectZ";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { pollCommits } from "~/lib/github";

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
        await pollCommits(project.id)
        return project;

    }),

    getAllProjects: protectedProcedure.query(async ({ ctx }) => {
        if (!ctx.user.userId) {
            throw new Error("User not found")
        }

        return ctx.db.project.findMany({
            where: {
                userToProject: {
                    some: {
                        userId: ctx.user.userId
                    }
                },
                deletedAt: null

            },
            orderBy: {
                createdAt: "desc"
            }
        })
    }),

    getAllCommits: protectedProcedure.input(getAllCommits).query(async ({ ctx, input }) => {
        if (!ctx.user.userId) {
            throw new Error("User not found")
        }
        pollCommits(input.projectId).then().catch(console.error)
        return ctx.db.commit.findMany({
            where: {
                project: {
                    id: input.projectId
                }
                
                
            },
            orderBy:{
                commitDate: "desc"
            }
        })
    }),



})

