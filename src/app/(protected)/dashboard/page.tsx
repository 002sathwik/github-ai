"use client"
import { useUser } from '@clerk/nextjs'
import { ExternalLink, Github } from 'lucide-react'
import React from 'react'
import UseProject from '~/hooks/use-project'
import Link from 'next/link'

const DashboardPage = () => {

    const { project } = UseProject()
    return (
        <div>
            <div className=' flex items-center justify-between flex-wrap gay-y-4'>
                {/* github link */}
                <div className='w-fit  rounded-sm bg-neutral-900 p-2 font-sora '>
                    <div className="flex items-center">
                        <Github className=' size-5  text-white rounded-lg' />
                        <div className="ml-2">
                            <p className="text-sm font-medium text-white">
                                This project is linked to
                                <Link href={project?.githubUrl || '#'} className='inline-flex items-center text-white/80 hover:underline '>
                                    {project?.githubUrl}
                                    <ExternalLink className='ml-1 size-4' />
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="h-4"></div>
                <div className="flex items-center gap-4">
                    TeamMembers
                    InviteButton
                    ArchiveButton
                </div>
            </div>
            <div className="mt-4">
                <div className='grid grid-col-1 gap-4 sm:grid-cols-5'>
                    AskQuestion
                    MeetingCard
                </div>
            </div>
        <div className="mt-8"></div>
        
        </div>
    )
}

export default DashboardPage 