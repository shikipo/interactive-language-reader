import { useState } from 'react'

import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'

import { FileUploadTable } from './components/file-upload-table'
import { PdfViewer, type PdfPageRegions } from './components/pdf-viewer'
import { ProgressBar } from './components/progress-bar'

const LANGUAGE_DIRECTIONS = {
	'DE-EN': {
		from: 'DE',
		to: 'EN',
		sourceLanguage: 'deu',
		targetLanguage: 'EN-US',
	},
	'EN-DE': {
		from: 'EN',
		to: 'DE',
		sourceLanguage: 'eng',
		targetLanguage: 'DE',
	},
} as const

function DirectionLabel({ from, to }: { from: string; to: string }) {
	return (
		<span className='inline-flex items-center gap-1.5'>
			{from}
			<HugeiconsIcon
				icon={ArrowRight01Icon}
				strokeWidth={2}
				className='size-3.5'
			/>
			{to}
		</span>
	)
}

type LanguageDirection = keyof typeof LANGUAGE_DIRECTIONS
type Status = 'idle' | 'uploading' | 'error' | 'done'

// Uses XHR (not fetch) because only XHR exposes real upload progress events.
// The backend OCRs every page before responding, so once the upload reaches
// 100% there's no further signal until the full response lands.
function uploadPdf(
	formData: FormData,
	onProgress: (percent: number) => void
): Promise<{ session_id: string; pages: PdfPageRegions[] }> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()

		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable) {
				onProgress((event.loaded / event.total) * 100)
			}
		}

		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve(JSON.parse(xhr.responseText))
			} else {
				reject(new Error(`Server responded with ${xhr.status}`))
			}
		}

		xhr.onerror = () => reject(new Error('Network error'))

		xhr.open('POST', 'http://127.0.0.1:8000/pdf/translate')
		xhr.send(formData)
	})
}

export function Dashboard() {
	const [status, setStatus] = useState<Status>('idle')
	const [uploadProgress, setUploadProgress] = useState(0)
	const [uploadError, setUploadError] = useState<string | null>(null)
	const [pdfFile, setPdfFile] = useState<File | null>(null)
	const [pageRegions, setPageRegions] = useState<PdfPageRegions[]>([])
	const [sessionId, setSessionId] = useState<string | null>(null)
	const [direction, setDirection] = useState<LanguageDirection>('DE-EN')
	const [activeLanguages, setActiveLanguages] = useState<
		(typeof LANGUAGE_DIRECTIONS)[LanguageDirection]
	>(LANGUAGE_DIRECTIONS['DE-EN'])

	const resetToUpload = () => {
		setStatus('idle')
		setPdfFile(null)
		setPageRegions([])
		setSessionId(null)
		setUploadError(null)
	}

	return (
		<>
			<Header fixed>
				<div className='ms-auto flex items-center space-x-4'>
					<ThemeSwitch />
				</div>
			</Header>

			<Main fixed className='flex flex-col'>
				{status === 'done' && pdfFile ? (
					<PdfViewer
						file={pdfFile}
						pages={pageRegions}
						sessionId={sessionId}
						sourceLanguage={activeLanguages.sourceLanguage}
						targetLanguage={activeLanguages.targetLanguage}
					/>
				) : status === 'uploading' || status === 'error' ? (
					<div className='flex flex-1 items-center justify-center'>
						<ProgressBar
							status={status}
							uploadProgress={uploadProgress}
							errorMessage={uploadError ?? undefined}
							onRetry={resetToUpload}
						/>
					</div>
				) : (
					<div className='flex flex-1 flex-col'>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='outline' className='mx-auto mb-4'>
									<DirectionLabel {...LANGUAGE_DIRECTIONS[direction]} />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuGroup>
									<DropdownMenuLabel>Translation direction</DropdownMenuLabel>
									<DropdownMenuRadioGroup
										value={direction}
										onValueChange={(value) =>
											setDirection(value as LanguageDirection)
										}
									>
										{Object.entries(LANGUAGE_DIRECTIONS).map(
											([key, { from, to }]) => (
												<DropdownMenuRadioItem key={key} value={key}>
													<DirectionLabel from={from} to={to} />
												</DropdownMenuRadioItem>
											)
										)}
									</DropdownMenuRadioGroup>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
						<FileUploadTable
							className='flex-1'
							onUploadStart={async (file) => {
								setPdfFile(file)
								setStatus('uploading')
								setUploadProgress(0)
								setUploadError(null)
								setPageRegions([])
								setSessionId(null)

								const languages = LANGUAGE_DIRECTIONS[direction]
								setActiveLanguages(languages)

								const formData = new FormData()
								formData.append('file', file)
								formData.append('source_language', languages.sourceLanguage)

								try {
									const { session_id, pages } = await uploadPdf(
										formData,
										setUploadProgress
									)
									setSessionId(session_id)
									setPageRegions(pages)
									setStatus('done')
								} catch {
									setUploadError(
										'Could not process this PDF. Please try again.'
									)
									setStatus('error')
								}
							}}
						/>
					</div>
				)}
			</Main>
		</>
	)
}
