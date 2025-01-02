
import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github'
import { Document } from '@langchain/core/documents'
import { generateEmbeddingOfSummary, summariseCode } from './gemini'
import { db } from '~/server/db'
import { getDefaultBranch } from './github';








export const loadgithubRepo = async (githubUrl: string, githubToken?: string) => {
    const defaultBranch = await getDefaultBranch(githubUrl)
    const loader = new GithubRepoLoader(githubUrl, {
        accessToken: githubToken || process.env.GITHUB_TOKEN,
        branch: defaultBranch,
        ignoreFiles: ['bun.lockb', '.gitignore', 'README.md', 'LICENSE', 'CONTRIBUTING.md', 'CODE_OF_CONDUCT.md', 'PULL_REQUEST_TEMPLATE.md', 'ISSUE_TEMPLATE.md', 'package.json', 'package-lock.json', 'yarn.lock', 'tsconfig.json', 'tsconfig.build.json', 'jest.config.js', 'jest.setup.js', 'jest.setup.ts', 'jest.setup.tsx', 'jest.setup.babel.js', 'jest.setup.babel.ts', 'jest.setup.babel.tsx', 'jest.setup.mjs', 'jest.setup.cjs', 'jest.setup.esm.js', 'jest.setup.esm.ts', 'jest.setup.esm.tsx', 'jest.setup.esm.mjs', 'jest.setup.esm'],
        recursive: true,
        unknown: 'warn',
        maxConcurrency: 5,
    })

    const docs = await loader.load()
    return docs

}


export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    const docs = await loadgithubRepo(githubUrl, githubToken)
    const allEmbedings = await generateEmbeddings(docs)
    await Promise.allSettled(allEmbedings.map(async (embedding, index) => {
        console.log(`Indexing ${index} of ${allEmbedings.length}`)
        if (!embedding) {
            throw new Error('Failed to generate embeddings')
        }

        const sourceCodeEmbedding = await db.sourceCodeEmbeaddings.create({
            data: {
                projectId,
                fileName: embedding.fileName,
                sourceCode: embedding.sourceCode,
                summary: embedding.summary,
            }
        })

        await db.$executeRaw`
        UPDATE "SourceCodeEmbeaddings" 
        SET "summaryEmbeddings" = ${embedding.embedding}::vector 
        WHERE "id" = ${sourceCodeEmbedding.id}
    `

    }))
}

const generateEmbeddings = async (docs: Document[]) => {

    return await Promise.all(docs.map(async (doc) => {
        const summary = await summariseCode(doc)

        const embedding = await generateEmbeddingOfSummary(summary)

        return {
            summary,
            embedding,
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName: doc.metadata.source,
        }
    }))

}

