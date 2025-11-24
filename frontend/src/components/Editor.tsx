import { useRef, useCallback } from 'react'
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import { KeyboardToolbar } from './KeyboardToolbar'

interface EditorProps {
  value: string
  onChange: (value: string) => void
}

export function Editor({ value, onChange }: EditorProps) {
  const editorRef = useRef<ReactCodeMirrorRef>(null)

  const handleInsert = useCallback((text: string) => {
    const view = editorRef.current?.view
    if (!view) return

    const { state } = view
    const selection = state.selection.main

    // Insert text at cursor position
    view.dispatch({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: text
      },
      selection: {
        anchor: selection.from + text.length
      }
    })

    // Refocus editor after button press
    view.focus()
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Editor area */}
      <div className="flex-1 overflow-hidden rounded-lg border border-slate-700">
        <CodeMirror
          ref={editorRef}
          value={value}
          onChange={onChange}
          extensions={[python()]}
          theme={oneDark}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: false,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: false,
            highlightSelectionMatches: true,
            searchKeymap: true,
            tabSize: 4,
          }}
          style={{ height: '100%' }}
        />
      </div>

      {/* Keyboard toolbar */}
      <KeyboardToolbar onInsert={handleInsert} />
    </div>
  )
}
