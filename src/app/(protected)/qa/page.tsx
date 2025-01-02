'use client'
import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import UseProject from '~/hooks/use-project'
import { api } from '~/trpc/react'
import AskQuestions from '../dashboard/ask-question'
import MDEditor from '@uiw/react-md-editor'
import CodeReferences from '../dashboard/code-references'

const QApage = () => {
  const { projectId } = UseProject()
  const { data: questions } = api.question.getQuestions.useQuery({ projectId })
  const [questionIndex, setQuestionIndex] = React.useState(0)

  const question = questions?.[questionIndex]
  return (
    <Sheet>
      <AskQuestions />
      <div className="h-4"></div>
      <h1 className='text-xl fonr-semibold font-grotesk'>Saved Questions</h1>
      <div className="h-2"></div>
      <div className="flex flex-col gap-2">
        {questions?.map((q, i) => {
          return <React.Fragment key={q.id}>
            <SheetTrigger onClick={() => setQuestionIndex(i)}>
              <div className='flex items-center gap-4 bg-white p-4 rounded-md shadow-xl'>
                <img src={q.user.imageUrl!} className='rounded-full' height={30} width={30} />
                <div className='text-left flex flex-col'>
                  <div className='flex items-center justify-between gap-2  mb-2'>
                    <p className='text-gray-700 text-lg font-bold font-grotesk line-clamp-1'>
                      {q.question}
                    </p>
                    <span className='text-sm font-grotesk text-gray-400 whitespace-nowrap'>
                      {q.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className='text-gray-500 font-grotesk line-clamp-2 text-sm'>
                    {q.answer}
                  </p>
                </div>
              </div>
            </SheetTrigger>
          </React.Fragment>
        })}
      </div>
      {question && (
        <SheetContent className='sm:max-w-[90vw]'>
          <SheetHeader>
            <SheetTitle className='bg-blue-500 text-white p-2 w-fit rounded-md font-grotesk'>
              {question.question}
            </SheetTitle>
            <MDEditor.Markdown
              source={question.answer}
              className="!bg-white !text-black [&>pre]:!bg-black [&>pre]:!text-white [&>code]:!text-white 
               font-grotesk max-w-[90vw] !h-full max-h-[40vh] overflow-scroll"
            />
            <CodeReferences
              filesReferences={(question.fileReferences ?? []) as any} />
          </SheetHeader>

        </SheetContent>
      )}
    </Sheet>
  )
}

export default QApage
