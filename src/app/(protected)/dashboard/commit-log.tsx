'use client'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import UseProject from '~/hooks/use-project'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'

const CommitLogs = () => {
    const { projectId, project } = UseProject()
    const { data: commits, error, refetch } = api.project.getAllCommits.useQuery({ projectId })
    return (
        <>
            <ul className='space-y-6'>
                {commits?.map((commit, commitIdx) => {
                    return <li key={commitIdx} className='relative flex gap-x-104'>
                        <div className={cn(
                            commitIdx === commits.length - 1 ? "h-6" : '-bottom-6',
                            'absolute left-0 top-0 flex w-6 justify-center '
                        )}>
                            <div className='w-px translate-x-1 bg-gray-300' />

                        </div>
                        <>
                            <img src={commit.commitAuthorAvatar} alt='commit avthor' className='relative size-8 mt-1 flex-none rounded-full bg-gray-50' />
                            <div className='flex-auto rounded-md bg-white p-3 m-2 ring-1 ring-inset ring-gray-200'>
                                <div className='flex justify-between gap-x-4'>

                                    <Link target='_blank' href={`${project?.githubUrl}/commit/${commit.commitHash}`} className="p-y-0.5 text-xs text-gray-500 flex justify-center gap-1 " >
                                        <span className='font-medium text-gray-800 font-grotesk'>
                                            {commit.commitAuthorName}
                                        </span>
                                        <span className='inline-flex items-center font-grotesk'>
                                            commited
                                        </span>
                                        <ExternalLink className='ml-1 size-4' />
                                    </Link>
                                </div>
                                <span className='font-semibold font-grotesk'>
                                    {commit.commitMessage}
                                </span>
                                <pre className='mt-2 whitespace-pre-wrap text-sm text-gray-500 leading-6 font-grotesk'>
                                    {commit.summary}
                                </pre>
                            </div>


                        </>
                    </li>


                })}
            </ul >
        </>
    )
}

export default CommitLogs
