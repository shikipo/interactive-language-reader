import { useState } from 'react'

import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

import { words } from '../data/words.ts'

pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`



const PAGE_WIDTH = 700

interface PageInfo {
  naturalWidth: number
  naturalHeight: number
}

export function PdfViewer({ file }: { file: File | string }) {
  const [numPages, setNumPages] = useState(0)
  const [pageInfos, setPageInfos] = useState<Record<number, PageInfo>>({})

  return (
    <div className='overflow-auto rounded-xl border p-4'>
      <Document
        file={file}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => {
          const info = pageInfos[pageNum]
          const scale = info ? PAGE_WIDTH / info.naturalWidth : 1

          return (
            <div key={pageNum} className='relative mb-4'>
              <Page
                pageNumber={pageNum}
                width={PAGE_WIDTH}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onLoadSuccess={(page) => {
                  const vp = page.getViewport({ scale: 1 })
                  setPageInfos((prev) => ({
                    ...prev,
                    [pageNum]: {
                      naturalWidth: vp.width,
                      naturalHeight: vp.height,
                    },
                  }))
                }}
              />
              {info &&
                words
                  .filter((w) => w.page === pageNum)
                  .map((w) => (
                    <div
                      key={w.id}
                      className='group absolute cursor-pointer border border-primary'
                      style={{
                        left: w.x * scale,
                        top: (info.naturalHeight - w.y - w.h) * scale,
                        width: w.w * scale,
                        height: w.h * scale,
                      }}
                    >
                      <span className='pointer-events-none absolute -top-6 left-0 hidden whitespace-nowrap rounded bg-primary px-1.5 py-0.5 text-xs text-primary-foreground group-hover:block'>
                        {w.text}
                      </span>
                    </div>
                  ))}
            </div>
          )
        })}
      </Document>
    </div>
  )
}
