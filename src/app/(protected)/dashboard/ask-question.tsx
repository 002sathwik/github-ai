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

const AskQuestions = () => {
    const [question, setQuestion] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const { project } = UseProject();
    const [filesReferences, setFilesReferences] = React.useState<{ fileName: string; sourceCode: string; summary: string }[]>([]);
    const [answers, setAnswers] = React.useState('')
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!project?.id) return;
        setLoading(true);
        setOpen(true);
        const { output, filesReferences } = await askQuestion({ question, projectId: project.id });
        setFilesReferences(filesReferences);

        for await (const delta of readStreamableValue(output)) {
            if (delta) {
                setAnswers(ans => ans + delta)
            }
        }
        setLoading(false);
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
                        <Button type='submit' className='rounded-lg font-grotesk'>
                            Ask Question!
                        </Button>
                    </form>
                </CardContent>
            </Card>


            {open && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                <RibbonIcon size={30} />
                            </DialogTitle>
                        </DialogHeader>
                        <p className='font-grotesk'>Your Answer</p>
                        <div className="h-4"></div>
                        <div>
                            {answers}
                        </div>
                        {
                            filesReferences.map(file => {
                                return <span>{file.fileName}</span>
                            })
                        }
                        <Button className='rounded-lg font-grotesk' onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

export default AskQuestions;
