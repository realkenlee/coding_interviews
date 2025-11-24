interface OutputProps {
  stdout: string
  stderr: string
  isLoading: boolean
  success?: boolean
}

export function Output({ stdout, stderr, isLoading, success }: OutputProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="spinner w-6 h-6 border-2 border-slate-600 border-t-emerald-500 rounded-full" />
        <span className="ml-3 text-slate-400">Running code...</span>
      </div>
    )
  }

  const hasOutput = stdout || stderr

  if (!hasOutput) {
    return (
      <div className="text-slate-500 text-center py-4">
        No output yet. Run your code to see results.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {stdout && (
        <div>
          <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${success ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            stdout
          </div>
          <pre className="font-mono text-sm text-slate-200 bg-slate-800 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap break-words">
            {stdout}
          </pre>
        </div>
      )}

      {stderr && (
        <div>
          <div className="text-xs font-medium text-red-400 mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            stderr
          </div>
          <pre className="font-mono text-sm text-red-300 bg-red-950/50 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap break-words border border-red-900/50">
            {stderr}
          </pre>
        </div>
      )}
    </div>
  )
}
