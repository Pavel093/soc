// server/utils/markdown.ts
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

export function renderMarkdown(markdown: string): string {
  return md.render(markdown)
}