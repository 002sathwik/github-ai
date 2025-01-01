'use client';

import React from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Textarea } from '~/components/ui/textarea';
import UseProject from '~/hooks/use-project';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { RibbonIcon } from 'lucide-react';
import { askQuestion } from './actions';
import { readStreamableValue } from 'ai/rsc';
import MDEditor from '@uiw/react-md-editor'
import TurndownService from 'turndown';
import CodeReferences from './code-references';
import { MultiStepLoader } from '~/components/ui/multi-step-loader';
import { Skeleton } from '~/components/ui/skeleton';
import SkeletonLoder from '~/components/loding-skeleton';


const AskQuestions = () => {
    const [question, setQuestion] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const { project } = UseProject();
    const [filesReferences, setFilesReferences] = React.useState<{ fileName: string; sourceCode: string; summary: string }[]>([]);
    const [answers, setAnswers] = React.useState('')

    const turndownService = new TurndownService();

    const onSubmit = async (e: React.FormEvent) => {
        setOpen(true);
        setAnswers('');
        setFilesReferences([]);
        e.preventDefault();
        if (!project?.id) return;
        setLoading(true);
        const { output, filesReferences } = await askQuestion({ question, projectId: project.id });
        setFilesReferences(filesReferences);

        let htmlOutput = '';
        for await (const delta of readStreamableValue(output)) {
            if (delta) {
                htmlOutput += delta;
            }
        }

        const markdown = turndownService.turndown(htmlOutput);
        setAnswers(markdown);
        setLoading(false);
        setQuestion('');
    }

    return (
        <div>
            <Card className='relative col-span-4'>
                <CardHeader>
                    <CardTitle className='font-grotesk'>Ask a Question</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Textarea
                            className='font-sora'
                            placeholder="Ask a question 'e.g' which file I should change to fix error"
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                        />
                        <div className="h-4"></div>
                        <Button type='submit' className='rounded-lg font-grotesk' disabled={loading}>
                            Ask Question!
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {open && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className='sm:max-w-[80vw] rounded-md'>
                        <DialogHeader>
                            <DialogTitle className='flex items-center space-x-2'>
                                <RibbonIcon size={30} />
                                <span className='font-grotesk'>Github-AI</span>
                            </DialogTitle>
                        </DialogHeader>

                        {loading ? (
                            <>
                                <SkeletonLoder />
                            </>
                        ) : (

                            <>
                                <MDEditor.Markdown
                                    source={answers}
                                    className="!bg-white !text-black [&>pre]:!bg-black [&>pre]:!text-white [&>code]:!text-white 
                             font-grotesk max-w-[80vw] !h-full max-h-[40vh] overflow-scroll"
                                />
                                <div className="h-2"></div>
                                <CodeReferences filesReferences={filesReferences} />
                            </>
                        )}
                    </DialogContent>
                </Dialog>

            )}
        </div>
    );
}


export default AskQuestions;
