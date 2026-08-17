"use client"

import React, { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Check, Copy } from "lucide-react"

interface MarkdownContentProps {
  content: string
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  return (
    <div className="prose prose-invert max-w-none text-white/90 text-sm leading-relaxed space-y-3 font-poppins">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Tables
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded border border-white/10 bg-black/60 shadow-lg">
              <table className="min-w-full divide-y divide-white/10 text-left text-xs font-poppins">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-white/5 text-white uppercase tracking-wider font-semibold border-b border-white/10">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-white/80 font-medium whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 border-t border-white/5 text-white/90 whitespace-nowrap">
              {children}
            </td>
          ),
          // Headings
          h1: ({ children }) => (
            <h1 className="text-lg font-bold text-white mt-4 mb-2 pb-1 border-b border-white/10">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-semibold text-white/90 mt-3 mb-1.5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold text-white/80 mt-2 mb-1">
              {children}
            </h3>
          ),
          // Paragraphs & Lists
          p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2 text-white/80">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2 text-white/80">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          code: ({ className, children, node, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "")
            const codeString = String(children).replace(/\n$/, "")
            const isBlock = Boolean(match) || codeString.includes("\n")

            if (isBlock) {
              return <CodeBlock language={match ? match[1] : "text"} code={codeString} />
            }

            return (
              <code className="bg-white/10 text-emerald-300 px-1.5 py-0.5 rounded font-mono text-xs font-normal">
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative my-3 rounded border border-white/10 bg-[#00050e] overflow-hidden font-mono text-xs shadow-md">
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10 text-white/50 text-[11px]">
        <span>{language.toUpperCase()}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[11px]"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Salin</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-emerald-300/90 leading-relaxed thin-scrollbar">
        <code>{code}</code>
      </pre>
    </div>
  )
}
