import { CircleAlertIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export function ProgressBar({
	status,
	uploadProgress,
	errorMessage,
	onRetry,
}: {
	status: 'uploading' | 'error'
	uploadProgress: number
	errorMessage?: string
	onRetry?: () => void
}) {
	if (status === 'error') {
		return (
			<Alert variant='destructive' className='w-[60%]'>
				<CircleAlertIcon className='size-4' />
				<AlertTitle>Upload failed</AlertTitle>
				<AlertDescription className='flex flex-col gap-2'>
					<p>
						{errorMessage ?? 'Something went wrong while processing the file.'}
					</p>
					{onRetry && (
						<Button
							variant='outline'
							size='sm'
							className='self-start'
							onClick={onRetry}
						>
							Try again
						</Button>
					)}
				</AlertDescription>
			</Alert>
		)
	}

	// Upload progress is real (tracked via XHR). Once all bytes are sent we have
	// no signal at all for OCR time on the backend, so the bar just stays full
	// and pulses instead of inventing a percentage for that phase.
	const isProcessing = uploadProgress >= 100

	return (
		<div className='flex w-[60%] flex-col items-center gap-2'>
			<Progress
				value={uploadProgress}
				className={cn('w-full', isProcessing && 'animate-pulse')}
			/>
			<p className='text-sm text-muted-foreground'>
				{isProcessing
					? 'Running OCR — this can take a moment'
					: `Uploading… ${Math.round(uploadProgress)}%`}
			</p>
		</div>
	)
}
