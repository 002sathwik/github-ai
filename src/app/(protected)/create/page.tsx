'use client'
import Image from 'next/image';
import React from 'react'
import { useForm } from "react-hook-form"
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { api } from '~/trpc/react';


type FormProps = {
    repoUrl: string;
    projectName: string;
    githubToken?: string;
}


const CreatePage = () => {
    const { register, handleSubmit, reset } = useForm<FormProps>();

    const createproject = api.project.createproject.useMutation()

    function handelSubmit(data: FormProps) {
        createproject.mutate({
            name: data.projectName,
            githubUrl: data.repoUrl,
            githubToken: data.githubToken
        }, {
            onSuccess: () => {
                toast.success('Project Created Successfully')
                reset()
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
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
                            {...register('githubToken', { required: true })}
                            placeholder='Github Token(optional)'
                            className='font-sora'
                            required
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
