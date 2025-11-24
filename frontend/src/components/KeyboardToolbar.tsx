interface KeyboardToolbarProps {
  onInsert: (text: string) => void
}

const SHORTCUTS = [
  // Brackets and symbols
  { label: '( )', value: '()' },
  { label: '[ ]', value: '[]' },
  { label: '{ }', value: '{}' },
  { label: ':', value: ':' },
  { label: '=', value: '=' },
  { label: '==', value: '==' },
  { label: '!=', value: '!=' },
  { label: '->', value: ' -> ' },
  // Indentation
  { label: 'Tab', value: '    ' },
  // Keywords
  { label: 'def', value: 'def ' },
  { label: 'return', value: 'return ' },
  { label: 'if', value: 'if ' },
  { label: 'elif', value: 'elif ' },
  { label: 'else:', value: 'else:\n    ' },
  { label: 'for', value: 'for ' },
  { label: 'while', value: 'while ' },
  { label: 'in', value: ' in ' },
  { label: 'range', value: 'range(' },
  { label: 'len', value: 'len(' },
  { label: 'None', value: 'None' },
  { label: 'True', value: 'True' },
  { label: 'False', value: 'False' },
  { label: 'class', value: 'class ' },
  { label: 'self', value: 'self' },
  { label: 'print', value: 'print(' },
  { label: 'lambda', value: 'lambda ' },
  { label: 'and', value: ' and ' },
  { label: 'or', value: ' or ' },
  { label: 'not', value: 'not ' },
]

export function KeyboardToolbar({ onInsert }: KeyboardToolbarProps) {
  return (
    <div className="keyboard-toolbar flex gap-1.5 overflow-x-auto py-2 px-2 bg-slate-800 border-t border-slate-700">
      {SHORTCUTS.map((shortcut, index) => (
        <button
          key={index}
          onClick={() => onInsert(shortcut.value)}
          className="flex-shrink-0 px-3 py-2 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded-lg text-sm font-mono text-slate-200 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          {shortcut.label}
        </button>
      ))}
    </div>
  )
}
