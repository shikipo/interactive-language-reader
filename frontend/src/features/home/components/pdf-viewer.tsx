import { useEffect, useRef, useState, type CSSProperties } from 'react'

import { CircleAlertIcon } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

// Used until the container has been measured for the first time.
const DEFAULT_PAGE_WIDTH = 700

// Pages are rasterized at 2x zoom server-side for OCR (see fitz.Matrix(2, 2)
// in backend/app/services/pdf.py) so region coordinates come back in pixels
// at double the PDF's point size. Divide by this to get back to PDF points.
const BACKEND_RENDER_SCALE = 2

export interface PdfRegion {
	text: string
	x: number
	y: number
	width: number
	height: number
}

export interface PdfPageRegions {
	page: number
	regions: PdfRegion[]
}

interface PageInfo {
	naturalWidth: number
	naturalHeight: number
}

function WordRegion({
	region,
	style,
	sessionId,
	pageNumber,
	imageWidth,
	imageHeight,
	sourceLanguage,
	targetLanguage,
}: {
	region: PdfRegion
	style: CSSProperties
	sessionId: string | null
	pageNumber: number
	imageWidth: number
	imageHeight: number
	sourceLanguage: string
	targetLanguage: string
}) {
	const [translated, setTranslated] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const handleHover = async () => {
		if (translated || loading || !sessionId) return
		setLoading(true)

		try {
			const centerX = region.x + region.width / 2
			const centerY = region.y + region.height / 2

			const response = await fetch('http://127.0.0.1:8000/translate/hover', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					session_id: sessionId,
					page_number: pageNumber,
					x: (centerX / imageWidth) * 100,
					y: (centerY / imageHeight) * 100,
					source_language: sourceLanguage,
					target_language: targetLanguage,
				}),
			})

			const data = await response.json()
			setTranslated(data.matched ? data.translated : region.text)
		} catch {
			setTranslated(region.text)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div
			className='group absolute cursor-pointer border border-primary'
			style={style}
			onMouseEnter={handleHover}
		>
			<span className='pointer-events-none absolute -top-6 left-0 hidden rounded bg-primary px-1.5 py-0.5 text-xs whitespace-nowrap text-primary-foreground group-hover:block'>
				{loading ? '…' : (translated ?? region.text)}
			</span>
		</div>
	)
}

export function PdfViewer({
	file,
	pages,
	sessionId,
	sourceLanguage,
	targetLanguage,
}: {
	file: File | string
	pages: PdfPageRegions[]
	sessionId: string | null
	sourceLanguage: string
	targetLanguage: string
}) {
	const [numPages, setNumPages] = useState(0)
	const [pageInfos, setPageInfos] = useState<Record<number, PageInfo>>({})
	const [loadError, setLoadError] = useState<string | null>(null)
	const [containerWidth, setContainerWidth] = useState(DEFAULT_PAGE_WIDTH)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = containerRef.current
		if (!el) return

		const observer = new ResizeObserver((entries) => {
			setContainerWidth(entries[0].contentRect.width)
		})
		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	if (loadError) {
		return (
			<Alert variant='destructive'>
				<CircleAlertIcon className='size-4' />
				<AlertTitle>Couldn&apos;t display this PDF</AlertTitle>
				<AlertDescription>{loadError}</AlertDescription>
			</Alert>
		)
	}

	return (
		<div ref={containerRef} className='overflow-auto rounded-xl border p-4'>
			<Document
				file={file}
				loading={null}
				onLoadSuccess={({ numPages }) => setNumPages(numPages)}
				onLoadError={(error) => setLoadError(error.message)}
			>
				{Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => {
					const info = pageInfos[pageNum]
					const scale = info ? containerWidth / info.naturalWidth : 1

					return (
						<div key={pageNum} className='relative mb-4'>
							<Page
								pageNumber={pageNum}
								width={containerWidth}
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
								(pages.find((p) => p.page === pageNum)?.regions ?? []).map(
									(region, i) => (
										<WordRegion
											key={i}
											region={region}
											pageNumber={pageNum}
											sessionId={sessionId}
											imageWidth={info.naturalWidth * BACKEND_RENDER_SCALE}
											imageHeight={info.naturalHeight * BACKEND_RENDER_SCALE}
											sourceLanguage={sourceLanguage}
											targetLanguage={targetLanguage}
											style={{
												left: (region.x / BACKEND_RENDER_SCALE) * scale,
												top: (region.y / BACKEND_RENDER_SCALE) * scale,
												width: (region.width / BACKEND_RENDER_SCALE) * scale,
												height: (region.height / BACKEND_RENDER_SCALE) * scale,
											}}
										/>
									)
								)}
						</div>
					)
				})}
			</Document>
		</div>
	)
}
