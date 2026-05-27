import * as React from 'react'

import { cn } from '@/lib/utils'

function Progress({
	className,
	value,
	...props
}: React.ComponentProps<'div'> & { value?: number }) {
	return (
		<div
			data-slot='progress'
			role='progressbar'
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={value ?? 0}
			className={cn(
				'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
				className
			)}
			{...props}
		>
			<div
				className='h-full bg-primary transition-all'
				style={{ width: `${value ?? 0}%` }}
			/>
		</div>
	)
}

export { Progress }
