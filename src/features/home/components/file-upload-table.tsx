import { useEffect } from 'react'

import { CircleAlertIcon, FileUpIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import { useFileUpload, type FileWithPreview } from '@/hooks/use-file-upload'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface FileUploadTableProps {
	maxFiles?: number
	maxSize?: number
	accept?: string
	multiple?: boolean
	className?: string
	onFilesChange?: (files: FileWithPreview[]) => void
	onUploadStart?: (file: File) => void
}

export function FileUploadTable({
	maxFiles = 1,
	maxSize = 10 * 1024 * 1024,
	accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
	multiple = false,
	className,
	onFilesChange,
	onUploadStart,
}: FileUploadTableProps) {
	const [
		{ isDragging, errors, files },
		{
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
		onFilesChange,
	})

	useEffect(() => {
		if (files.length === 0) return
		const raw = files[0].file
		if (raw instanceof File) onUploadStart?.(raw)
	}, [files.length])

	return (
		<div className={cn('flex w-full flex-col space-y-4', className)}>
			<div
				className={cn(
					'relative flex flex-1 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 text-center transition-colors',
					isDragging
						? 'border-primary bg-primary/5'
						: 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
				)}
				onClick={openFileDialog}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
			>
				<input {...getInputProps()} className='sr-only' />
				<div className='flex flex-col items-center gap-3'>
					<FileUpIcon className='size-12 text-primary' />
					<p className='text-sm font-medium'>
						Drag file here or{' '}
						<span className='text-primary underline-offset-4 hover:underline'>
							select file via upload
						</span>
					</p>
				</div>
			</div>

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
