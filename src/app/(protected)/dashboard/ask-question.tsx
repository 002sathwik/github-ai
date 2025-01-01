'use client';

import React from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Textarea } from '~/components/ui/textarea';
import UseProject from '~/hooks/use-project';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { RibbonIcon } from 'lucide-react';

const AskQuestions = () => {
    const [question, setQuestion] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const { project } = UseProject();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setOpen(true);
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
                        <p className='font-grotesk'>Your Question has been submitted to the team</p>
                        <div className="h-4"></div>
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
