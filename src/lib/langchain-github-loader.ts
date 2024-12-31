
import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github'

export const loadgithubRepo = async (githubUrl: string, githubToken?: string) => {


    const loader = new GithubRepoLoader(githubUrl, {
        accessToken: githubToken || '',
        branch: 'main',
        ignoreFiles: ['bun.lockb', '.gitignore', 'README.md', 'LICENSE', 'CONTRIBUTING.md', 'CODE_OF_CONDUCT.md', 'PULL_REQUEST_TEMPLATE.md', 'ISSUE_TEMPLATE.md', 'package.json', 'package-lock.json', 'yarn.lock', 'tsconfig.json', 'tsconfig.build.json', 'jest.config.js', 'jest.setup.js', 'jest.setup.ts', 'jest.setup.tsx', 'jest.setup.babel.js', 'jest.setup.babel.ts', 'jest.setup.babel.tsx', 'jest.setup.mjs', 'jest.setup.cjs', 'jest.setup.esm.js', 'jest.setup.esm.ts', 'jest.setup.esm.tsx', 'jest.setup.esm.mjs', 'jest.setup.esm'],
        recursive: true,
        unknown: 'warn',
        maxConcurrency: 5,
    })

    const docs = await loader.load()
    return docs

}

console.log(await loadgithubRepo('https://github.com/002sathwik/github-ai'))