import { useState, useEffect, useCallback, useRef } from 'react'

interface TimerState {
  elapsed: number // milliseconds
  isRunning: boolean
  startTime: number | null
}

export function useTimer() {
  const [state, setState] = useState<TimerState>({
    elapsed: 0,
    isRunning: false,
    startTime: null
  })

  const intervalRef = useRef<number | null>(null)
  const hiddenTimeRef = useRef<number | null>(null)

  // Format time as MM:SS
  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, [])

  // Start or resume timer
  const start = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: true,
      startTime: Date.now() - prev.elapsed
    }))
  }, [])

  // Pause timer
  const pause = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: false
    }))
  }, [])

  // Reset timer
  const reset = useCallback(() => {
    setState({
      elapsed: 0,
      isRunning: false,
      startTime: null
    })
  }, [])

  // Toggle timer
  const toggle = useCallback(() => {
    setState(prev => {
      if (prev.isRunning) {
        return { ...prev, isRunning: false }
      } else {
        return {
          ...prev,
          isRunning: true,
          startTime: Date.now() - prev.elapsed
        }
      }
    })
  }, [])

  // Update elapsed time
  useEffect(() => {
    if (state.isRunning && state.startTime !== null) {
      intervalRef.current = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          elapsed: Date.now() - (prev.startTime || Date.now())
        }))
      }, 100) // Update every 100ms for smooth display
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state.isRunning, state.startTime])

  // Handle Page Visibility API - track time when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && state.isRunning) {
        // Tab hidden - store current time
        hiddenTimeRef.current = Date.now()
      } else if (!document.hidden && hiddenTimeRef.current && state.isRunning) {
        // Tab visible again - no action needed since we use Date.now() - startTime
        hiddenTimeRef.current = null
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [state.isRunning])

  return {
    elapsed: state.elapsed,
    isRunning: state.isRunning,
    formattedTime: formatTime(state.elapsed),
    start,
    pause,
    reset,
    toggle
  }
}
