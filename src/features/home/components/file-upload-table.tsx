import { useEffect, useState } from 'react'

import {
	CircleAlertIcon,
	CloudUploadIcon,
	DownloadIcon,
	FileArchiveIcon,
	FileSpreadsheetIcon,
	FileTextIcon,
	HeadphonesIcon,
	ImageIcon,
	RefreshCwIcon,
	Trash2Icon,
	UploadIcon,
	VideoIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'

import {
	formatBytes,
	useFileUpload,
	type FileMetadata,
	type FileWithPreview,
} from '@/hooks/use-file-upload'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'

import { Badge } from '@/components/reui/badge'

interface FileUploadItem extends FileWithPreview {
	progress: number
	status: 'uploading' | 'completed' | 'error'
	error?: string
}

interface FileUploadTableProps {
	maxFiles?: number
	maxSize?: number
	accept?: string
	multiple?: boolean
	className?: string
	onFilesChange?: (files: FileWithPreview[]) => void
	simulateUpload?: boolean
}

export function FileUploadTable({
	maxFiles = 1,
	maxSize = 10 * 1024 * 1024,
	accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
	multiple = false,
	className,
	onFilesChange,
	simulateUpload = true,
}: FileUploadTableProps) {
	const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>([])

	const [
		{ isDragging, errors },
		{
			removeFile,
			clearFiles,
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			getInputProps,
		},
	] = useFileUpload({
		maxFiles,
		maxSize,
		accept,
		multiple,
		onFilesChange: (newFiles) => {
			const newUploadFiles = newFiles.map((file) => {
				const existing = uploadFiles.find((f) => f.id === file.id)
				if (existing) return { ...existing, ...file }
				return { ...file, progress: 0, status: 'uploading' as const }
			})
			setUploadFiles(newUploadFiles)
			onFilesChange?.(newFiles)
		},
	})

	useEffect(() => {
		if (!simulateUpload) return

		const interval = setInterval(() => {
			setUploadFiles((prev) =>
				prev.map((file) => {
					if (file.status !== 'uploading') return file
					const newProgress = Math.min(
						file.progress + Math.random() * 15 + 5,
						100
					)
					if (newProgress >= 100) {
						return { ...file, progress: 100, status: 'completed' as const }
					}
					return { ...file, progress: newProgress }
				})
			)
		}, 300)

		return () => clearInterval(interval)
	}, [simulateUpload])

	const removeUploadFile = (id: string) => {
		setUploadFiles((prev) => prev.filter((f) => f.id !== id))
		removeFile(id)
	}

	const retryUpload = (id: string) => {
		setUploadFiles((prev) =>
			prev.map((f) =>
				f.id === id
					? {
							...f,
							progress: 0,
							status: 'uploading' as const,
							error: undefined,
						}
					: f
			)
		)
	}

	const getFileIcon = (file: File | FileMetadata) => {
		const type = file.type
		if (type.startsWith('image/')) return <ImageIcon className='size-4' />
		if (type.startsWith('video/')) return <VideoIcon className='size-4' />
		if (type.startsWith('audio/')) return <HeadphonesIcon className='size-4' />
		if (type.includes('pdf')) return <FileTextIcon className='size-4' />
		if (type.includes('word') || type.includes('doc'))
			return <FileTextIcon className='size-4' />
		if (type.includes('excel') || type.includes('sheet'))
			return <FileSpreadsheetIcon className='size-4' />
		if (type.includes('zip') || type.includes('rar'))
			return <FileArchiveIcon className='size-4' />
		return <FileTextIcon className='size-4' />
	}

	const getFileTypeLabel = (file: File | FileMetadata) => {
		const type = file.type
		if (type.startsWith('image/')) return 'Image'
		if (type.startsWith('video/')) return 'Video'
		if (type.startsWith('audio/')) return 'Audio'
		if (type.includes('pdf')) return 'PDF'
		if (type.includes('word') || type.includes('doc')) return 'Word'
		if (type.includes('excel') || type.includes('sheet')) return 'Excel'
		if (type.includes('zip') || type.includes('rar')) return 'Archive'
		if (type.includes('json')) return 'JSON'
		if (type.includes('text')) return 'Text'
		return 'File'
	}

	return (
		<div className={cn('flex w-full flex-col space-y-4', className)}>
			{/* Drop zone */}
			<div
				className={cn(
					'relative flex flex-1 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 text-center transition-colors',
					isDragging
						? 'border-primary bg-primary/5'
						: 'border-muted-foreground/25 hover:border-muted-foreground/50'
				)}
				onClick={openFileDialog}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
			>
				<input {...getInputProps()} className='sr-only' />
				<div className='flex flex-col items-center gap-3'>
					<img
						src='/images/Uploading.png'
						alt='Upload'
						className='size-42 object-contain'
					/>
					<div className='space-y-1'>
						<p className='text-sm font-medium'>
							Drag file here or{' '}
							<span className='text-primary underline-offset-4 hover:underline'>
								select file via upload
							</span>
						</p>
					</div>
				</div>
			</div>

			{/* Files table */}
			{uploadFiles.length > 0 && (
				<div className='space-y-3'>
					<div className='flex items-center justify-between'>
						<span className='text-sm font-medium'>
							Files ({uploadFiles.length})
						</span>
						<div className='flex gap-2'>
							<Button
								type='button'
								onClick={openFileDialog}
								variant='outline'
								size='sm'
							>
								<CloudUploadIcon className='size-4' />
								Add files
							</Button>
							<Button
								type='button'
								onClick={() => {
									clearFiles()
									setUploadFiles([])
								}}
								variant='outline'
								size='sm'
							>
								<Trash2Icon className='size-4' />
								Remove all
							</Button>
						</div>
					</div>

					<div className='rounded-md border'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='h-9 ps-4'>Name</TableHead>
									<TableHead className='h-9'>Type</TableHead>
									<TableHead className='h-9'>Size</TableHead>
									<TableHead className='h-9 w-24'>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{uploadFiles.map((item) => (
									<TableRow key={item.id}>
										<TableCell className='py-2 ps-2'>
											<div className='flex items-center gap-1.5'>
												<div className='relative flex size-8 shrink-0 items-center justify-center text-muted-foreground/80'>
													{item.status === 'uploading' ? (
														<>
															<svg
																className='size-8 -rotate-90'
																viewBox='0 0 32 32'
															>
																<circle
																	cx='16'
																	cy='16'
																	r='14'
																	fill='none'
																	stroke='currentColor'
																	strokeWidth='2'
																	className='text-muted-foreground/20'
																/>
																<circle
																	cx='16'
																	cy='16'
																	r='14'
																	fill='none'
																	stroke='currentColor'
																	strokeWidth='2'
																	strokeDasharray={`${2 * Math.PI * 14}`}
																	strokeDashoffset={`${2 * Math.PI * 14 * (1 - item.progress / 100)}`}
																	className='text-primary transition-all duration-300'
																	strokeLinecap='round'
																/>
															</svg>
															<div className='absolute inset-0 flex items-center justify-center'>
																{getFileIcon(item.file)}
															</div>
														</>
													) : (
														getFileIcon(item.file)
													)}
												</div>
												<span className='flex items-center gap-1.5 truncate text-sm font-medium'>
													{item.file.name}
													{item.status === 'error' && (
														<Badge
															variant='destructive-light'
															className='text-xs'
														>
															Error
														</Badge>
													)}
												</span>
											</div>
										</TableCell>
										<TableCell className='py-2'>
											<Badge variant='secondary' className='text-xs'>
												{getFileTypeLabel(item.file)}
											</Badge>
										</TableCell>
										<TableCell className='py-2 text-sm text-muted-foreground'>
											{formatBytes(item.file.size)}
										</TableCell>
										<TableCell className='py-2'>
											<div className='flex items-center gap-1'>
												{item.preview && (
													<Button
														type='button'
														size='icon'
														variant='ghost'
														className='size-8'
													>
														<DownloadIcon className='size-3.5' />
													</Button>
												)}
												{item.status === 'error' ? (
													<Button
														type='button'
														onClick={() => retryUpload(item.id)}
														variant='ghost'
														size='icon'
														className='size-8 text-destructive/80 hover:text-destructive'
													>
														<RefreshCwIcon className='size-3.5' />
													</Button>
												) : (
													<Button
														type='button'
														onClick={() => removeUploadFile(item.id)}
														variant='ghost'
														size='icon'
														className='size-8'
													>
														<Trash2Icon className='size-3.5' />
													</Button>
												)}
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			)}

			{/* Errors */}
			{errors.length > 0 && (
				<Alert variant='destructive'>
					<CircleAlertIcon className='size-4' />
					<AlertTitle>Upload error</AlertTitle>
					<AlertDescription>
						{errors.map((error, i) => (
							<p key={i}>{error}</p>
						))}
					</AlertDescription>
				</Alert>
			)}
		</div>
	)
}