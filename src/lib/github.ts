import { TRPCClientError } from '@trpc/client';
import { Octokit } from 'octokit';
import { db } from '~/server/db';




export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});


type Response = {
    commitMessage: String;
    commitHash: String;
    commitAuthorName: String;
    commitAuthorAvatar: String;
    commitDate: string;

}


export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
    const urlParts = githubUrl.replace(/https?:\/\/(www\.)?github\.com\//, "").split('/');
    const [owner, repoWithGit] = urlParts.slice(-2); 
    const repo = repoWithGit?.replace(/\.git$/, '') ?? '';
    if (!owner || !repo) {
        throw new TRPCClientError('Invalid Github URL');
    }
    console.log(owner, repo);
    const { data } = await octokit.rest.repos.listCommits({
       owner,
       repo,
    });

    const sortedCommits = data.sort((a: any, b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any[];

    return sortedCommits.slice(0, 10).map((commit: any) => ({
        commitMessage: commit.commit.message ?? "",
        commitHash: commit.sha as string,
        commitAuthorName: commit.commit.author.name ?? "",
        commitAuthorAvatar: commit.author.avatar_url ?? "",
        commitDate: commit.commit.author.date ?? "",
    }));
}


async function summariseCommits(githubUrl: string, commitHash: string) {


}



export const pollCommits = async (projectId: string) => {
    const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
    if (!project || !githubUrl) {
        throw new TRPCClientError('Project not found');
    }
    const commitsHashes = await getCommitHashes(githubUrl!);
    const unprocesseedCommits = await filterUnprocessedCommits(commitsHashes, projectId);
    console.log(unprocesseedCommits);

    return unprocesseedCommits;
}


async function fetchProjectGithubUrl(projectId: string) {
    const project = await db.project.findUnique({
        where: {
            id: projectId,
        },
        select: {
            githubUrl: true,
        }
    });
    if (!project?.githubUrl) {
        throw new TRPCClientError('Project not found');
    }
    return {
        project,
        githubUrl: project?.githubUrl,
    };
}


async function filterUnprocessedCommits(commitHashes: Response[], projectId: string) {
    const processedCommits = await db.commit.findMany({
        where: {
            projectId,
        },
    });

    const unprocessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash));
    return unprocessedCommits;
}


await pollCommits('cm5c161a300005bry3ukuf45u').then(console.log).catch(console.error);
