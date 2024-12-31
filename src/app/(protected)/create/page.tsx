'use client'
import { set } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { use, useState } from 'react'
import { useForm } from "react-hook-form"
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { MultiStepLoader } from '~/components/ui/multi-step-loader';
import UseRefetch from '~/hooks/use-refetch';
import { api } from '~/trpc/react';

type FormProps = {
    repoUrl: string;
    projectName: string;
    githubToken?: string;
}
const loadingStates = [
    {
        text: "creating a project",
    },
    {
        text: "Extracting commitsHashes",
    },
    {
        text: "summarising Responses",
    },
    {
        text: "Storing Commit summaries",
    },
];

const CreatePage = () => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset } = useForm<FormProps>();
    const createproject = api.project.createproject.useMutation();
    const router = useRouter()
    const refetch = UseRefetch()
    function handelSubmit(data: FormProps) {
        setLoading(true)
        createproject.mutate({
            name: data.projectName,
            githubUrl: data.repoUrl,
            githubToken: data.githubToken
        }, {
            onSuccess: () => {
                toast.success('Project Created Successfully')
                refetch()
                reset()
                router.push('/dashboard')
                setLoading(false)
            },
            onError: (error) => {
                toast.error(error.message)
                setLoading(false)
            }
        })
    }

    if (loading) {
        return (
            <div className="w-full h-[60vh] flex items-center justify-center">
                <MultiStepLoader loadingStates={loadingStates} loading={loading} duration={2000} />
            </div>
        )
    }

    return (
        <div className='flex items-center gap-12 h-full justify-center '>
            <Image src='/create.jpg' alt="developer" width={500} height={500} className='rounded-full h-56 w-auto' />
            <div>
                <div className='space-y-2 '>
                    <h1 className='font-semibold text-2xl font-grotesk '>
                        Link your Github Repository
                    </h1>
                    <p className='text-sm text-muted-foreground font-sora'>
                        Enter the URL of your repo to link it with Github-AI
                    </p>
                </div>
                <div className="h-4"></div>
                <div>
                    <form onSubmit={handleSubmit(handelSubmit)}>
                        <Input
                            {...register('projectName', { required: true })}
                            placeholder='Project Name'
                            className='font-sora'
                            required
                        />
                        <div className="h-2"></div>
                        <Input
                            {...register('repoUrl', { required: true })}
                            placeholder='Github Repository URL'
                            className='font-sora'
                            required
                        />
                        <div className="h-2"></div>
                        <Input
                            {...register('githubToken', { required: false })}
                            placeholder='Github Token(optional)'
                            className='font-sora'

                        />
                        <div className="h-3"></div>
                        <Button type='submit' className='w-full font-sora rounded-xl' disabled={createproject.isPending}>
                            Create Project
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreatePage
