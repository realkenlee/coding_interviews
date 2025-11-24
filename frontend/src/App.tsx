import { useState, useCallback, useEffect, useRef } from 'react'
import { Timer } from './components/Timer'
import { Editor } from './components/Editor'
import { Collapsible } from './components/Collapsible'
import { Output } from './components/Output'
import { useLocalStorage } from './hooks/useLocalStorage'

// API endpoint - change this for production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

type View = 'start' | 'coding'

interface ExecutionResult {
  stdout: string
  stderr: string
  success: boolean
  timeout: boolean
}

function App() {
  // Persisted state
  const [question, setQuestion] = useLocalStorage('interview-question', '')
  const [code, setCode] = useLocalStorage('interview-code', '# Write your solution here\n\n')
  const [savedView, setSavedView] = useLocalStorage<View>('interview-view', 'start')

  // Local state
  const [view, setView] = useState<View>(savedView)
  const [output, setOutput] = useState<ExecutionResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [timerElapsed, setTimerElapsed] = useState(0)

  const questionRef = useRef<HTMLTextAreaElement>(null)

  // Sync view to localStorage
  useEffect(() => {
    setSavedView(view)
  }, [view, setSavedView])

  // Auto-focus question textarea on start view
  useEffect(() => {
    if (view === 'start' && questionRef.current) {
      questionRef.current.focus()
    }
  }, [view])

  const handleStartCoding = useCallback(() => {
    if (!question.trim()) {
      alert('Please paste a question first')
      return
    }
    setView('coding')
    setOutput(null)
  }, [question])

  const handleRunCode = useCallback(async () => {
    setIsRunning(true)
    setOutput(null)

    try {
      const response = await fetch(`${API_URL}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ExecutionResult = await response.json()
      setOutput(result)
    } catch (error) {
      setOutput({
        stdout: '',
        stderr: `Failed to execute code: ${error instanceof Error ? error.message : 'Unknown error'}`,
        success: false,
        timeout: false,
      })
    } finally {
      setIsRunning(false)
    }
  }, [code])

  const handleNewQuestion = useCallback(() => {
    if (timerElapsed > 0) {
      const confirmed = window.confirm('Are you sure you want to start a new question? Your current progress will be lost.')
      if (!confirmed) return
    }
    setQuestion('')
    setCode('# Write your solution here\n\n')
    setOutput(null)
    setView('start')
  }, [timerElapsed, setQuestion, setCode])

  const handleTimerChange = useCallback((elapsed: number) => {
    setTimerElapsed(elapsed)
  }, [])

  // Start Screen
  if (view === 'start') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700 px-4 py-4">
          <h1 className="text-xl font-bold text-white">Python Interview Prep</h1>
          <p className="text-slate-400 text-sm mt-1">Paste your coding question below</p>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 flex flex-col">
          <textarea
            ref={questionRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Paste your interview question here...

Example:
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice."
            className="flex-1 w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
            style={{ minHeight: '200px' }}
          />

          <button
            onClick={handleStartCoding}
            disabled={!question.trim()}
            className="mt-4 w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-lg rounded-lg transition-colors"
          >
            Start Coding
          </button>
        </main>

        {/* Footer */}
        <footer className="p-4 text-center text-slate-600 text-sm safe-bottom">
          Add to Home Screen for the best experience
        </footer>
      </div>
    )
  }

  // Coding Screen
  return (
    <div className="h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Sticky Header with Timer */}
      <header className="flex-shrink-0 bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <Timer onTimerChange={handleTimerChange} />
        <button
          onClick={handleNewQuestion}
          className="px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          New
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-3 pb-0 flex flex-col gap-3">
        {/* Question Panel */}
        <Collapsible title="Question" defaultOpen={false}>
          <div className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
            {question}
          </div>
        </Collapsible>

        {/* Code Editor - Main Focus */}
        <div className="flex-1 min-h-[40vh]">
          <Editor value={code} onChange={setCode} />
        </div>

        {/* Run Button */}
        <button
          onClick={handleRunCode}
          disabled={isRunning}
          className="flex-shrink-0 w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-700 text-white font-bold text-lg rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isRunning ? (
            <>
              <div className="spinner w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              Running...
            </>
          ) : (
            <>
              <span className="text-xl">▶</span>
              Run Code
            </>
          )}
        </button>

        {/* Output Panel */}
        {(output || isRunning) && (
          <Collapsible
            title="Output"
            defaultOpen={true}
            badge={output?.success ? 'Success' : output?.stderr ? 'Error' : undefined}
          >
            <Output
              stdout={output?.stdout || ''}
              stderr={output?.stderr || ''}
              isLoading={isRunning}
              success={output?.success}
            />
          </Collapsible>
        )}

        {/* Bottom safe area spacer */}
        <div className="safe-bottom pb-4" />
      </main>
    </div>
  )
}

export default App
