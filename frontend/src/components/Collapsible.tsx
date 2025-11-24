import { useState, ReactNode } from 'react'

interface CollapsibleProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  badge?: string
}

export function Collapsible({ title, children, defaultOpen = false, badge }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-2">
          <span
            className={`text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          >
            ▶
          </span>
          <span className="font-medium text-slate-200">{title}</span>
          {badge && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-slate-600 text-slate-300">
              {badge}
            </span>
          )}
        </div>
        <span className="text-slate-500 text-sm">
          {isOpen ? 'Tap to collapse' : 'Tap to expand'}
        </span>
      </button>

      <div
        className={`collapsible-content ${isOpen ? 'max-h-[50vh] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 bg-slate-900">
          {children}
        </div>
      </div>
    </div>
  )
}
