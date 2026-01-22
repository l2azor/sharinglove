'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import 'react-quill-new/dist/quill.snow.css'

// react-quill은 SSR을 지원하지 않으므로 dynamic import 사용
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-md border bg-muted" />
  ),
})

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = '내용을 입력하세요...',
  className,
}: RichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['link', 'image'],
        ['clean'],
      ],
    }),
    []
  )

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'indent',
    'align',
    'link',
    'image',
  ]

  return (
    <div className={className}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="[&_.ql-container]:min-h-[200px] [&_.ql-container]:text-base [&_.ql-editor]:min-h-[200px]"
      />
      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border-color: hsl(var(--border));
          border-radius: 0.375rem 0.375rem 0 0;
          background: hsl(var(--muted));
        }
        .ql-container.ql-snow {
          border-color: hsl(var(--border));
          border-radius: 0 0 0.375rem 0.375rem;
          background: hsl(var(--background));
        }
        .ql-editor {
          font-family: inherit;
        }
        .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          font-style: normal;
        }
      `}</style>
    </div>
  )
}
