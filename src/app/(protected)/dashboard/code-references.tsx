'use client'
import { TabsContent } from '@radix-ui/react-tabs';
import React from 'react'
import { Button } from '~/components/ui/button';
import { Tabs } from '~/components/ui/tabs';
import { cn } from '~/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { lucario } from 'react-syntax-highlighter/dist/esm/styles/prism'
type Props = {
    filesReferences: { fileName: string; sourceCode: string; summary: string }[]
}

const CodeReferences = ({ filesReferences }: Props) => {
    const [tab, setTab] = React.useState(filesReferences[0]?.fileName)
    if (!filesReferences.length) return null
    return (
        <div className='max-w-[90vw]'>
            <Tabs value={tab} onValueChange={setTab}>
                <div className='overflow-scroll flex gap-2 bg-gray-300 rounded-md p-2'>
                    {filesReferences.map(file => (
                        <Button onClick={() => setTab(file.fileName)} key={file.fileName} className={cn(
                            `px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-muted-foreground hover:text-muted font-grotesk`,
                            {
                                'bg-primary  text-primary-foreground': tab === file.fileName,
                            }
                        )}>
                            {file.fileName}
                        </Button>
                    ))}

                </div>
                {filesReferences.map(file => (
                    <TabsContent key={file.fileName} value={file.fileName} className='max-h-[40vh] overflow-scroll max-w-9xl rounded-md font-grotesk'>
                        <SyntaxHighlighter language="typescript" style={lucario} showLineNumbers className="font-grotesk" >
                            {file.sourceCode}
                        </SyntaxHighlighter>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

export default CodeReferences