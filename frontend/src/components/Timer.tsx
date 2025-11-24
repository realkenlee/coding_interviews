import { useTimer } from '../hooks/useTimer'

interface TimerProps {
  onTimerChange?: (elapsed: number, isRunning: boolean) => void
}

export function Timer({ onTimerChange }: TimerProps) {
  const { formattedTime, isRunning, elapsed, toggle, reset } = useTimer()

  // Notify parent of timer changes
  if (onTimerChange) {
    onTimerChange(elapsed, isRunning)
  }

  return (
    <div className="flex items-center gap-3">
      {/* Timer display */}
      <div className="font-mono text-2xl font-bold text-white tabular-nums">
        {formattedTime}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={toggle}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-colors min-w-[60px] ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-black'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
          }`}
        >
          {isRunning ? 'Pause' : elapsed > 0 ? 'Resume' : 'Start'}
        </button>

        <button
          onClick={reset}
          className="px-3 py-1.5 rounded-lg font-medium text-sm bg-slate-600 hover:bg-slate-500 text-white transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
