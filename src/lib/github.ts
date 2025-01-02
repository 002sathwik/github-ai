import { TRPCClientError } from '@trpc/client';
import { Octokit } from 'octokit';
import { db } from '~/server/db';
import axios from 'axios';
import { aiSummariseCommits } from './gemini';




export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});


type Response = {
    commitMessage: string;
    commitHash: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    commitDate: string;

}

export const getDefaultBranch = async (githubUrl: string) => {
    const [owner, repo] = githubUrl.split("/").slice(-2);
    if (!owner || !repo) {
        throw new TRPCClientError('Invalid Github URL');
    }

    const { data } = await octokit.rest.repos.get({
        owner,
        repo,
    });

    return data.default_branch;
}




export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
    const [owner, repo] = githubUrl.split("/").slice(-2);
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



// Summarise commits
async function summariseCommits(githubUrl: string, commitHash: string) {

    console.log(`${githubUrl}/commit/${commitHash}.diff`);
    const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
        headers: {
            Accept: 'application/vnd.github.v3.diff',
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
        },
    });

    return await aiSummariseCommits(data);

}



export const pollCommits = async (projectId: string) => {
    const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
    if (!project || !githubUrl) {
        throw new Error('Project not found');
    }
    const commitsHashes = await getCommitHashes(githubUrl!);
    const unprocesseedCommits = await filterUnprocessedCommits(commitsHashes, projectId);
    const summarisesResponses = await Promise.allSettled(unprocesseedCommits.map(async (commit) => {
        return await summariseCommits(githubUrl, commit.commitHash);

    }));
    const summaries = summarisesResponses.map((response) => {
        if (response.status === 'fulfilled') {
            return response.value as string;
        } else {
            console.log("Filed to summarise commit", response.reason);
        }
        return "";
    })

    const commit = await db.commit.createMany({
        data: summaries.map((summary, index) => {
            return {
                projectId,
                commitHash: unprocesseedCommits[index]!.commitHash,
                commitMessage: unprocesseedCommits[index]!.commitMessage,
                commitAuthorName: unprocesseedCommits[index]!.commitAuthorName,
                commitAuthorAvatar: unprocesseedCommits[index]!.commitAuthorAvatar,
                commitDate: unprocesseedCommits[index]!.commitDate,
                summary,
            }!
        }
        )
    });
    return commit;
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

    return {
        project,
        githubUrl: project?.githubUrl
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


