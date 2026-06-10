import { useEffect, useState } from 'react'

import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Progress } from '@/components/ui/progress'
import { ThemeSwitch } from '@/components/theme-switch'

import docPdfUrl from './data/doc.pdf?url'

import { FileUploadTable } from './components/file-upload-table'
import { PdfViewer } from './components/pdf-viewer'

export function Dashboard() {
	const [uploading, setUploading] = useState(false)
	const [showPdf, setShowPdf] = useState(false)
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		if (!uploading) return
		const interval = setInterval(() => {
			setProgress((prev) => {
				const next = Math.min(prev + Math.random() * 15 + 5, 100)
				if (next >= 100) {
					clearInterval(interval)
					setShowPdf(true)
					return 100
				}
				return next
			})
		}, 300)
		return () => clearInterval(interval)
	}, [uploading])

	return (
		<>
			<Header fixed>
				<div className='ms-auto flex items-center space-x-4'>
					<ThemeSwitch />
				</div>
			</Header>

			<Main fixed className='flex flex-col'>
				{showPdf ? (
					<PdfViewer file={docPdfUrl} />
				) : uploading ? (
					<div className='flex flex-1 items-center justify-center'>
						<Progress value={progress} className='w-[60%]' />
					</div>
				) : (
					<div className='flex flex-1 flex-col'>
						<p className='mb-4 text-center text-sm text-muted-foreground'>
							DE &lt;-&gt; EN
						</p>
						<FileUploadTable
							className='flex-1'
							onUploadStart={() => { setProgress(0); setUploading(true) }}
						/>
					</div>
				)}
			</Main>
		</>
	)
}
