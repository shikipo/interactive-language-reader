import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'

import { FileUploadTable } from './components/file-upload-table'

export function Dashboard() {
	return (
		<>
			<Header fixed>
				<div className='ms-auto flex items-center space-x-4'>
					<ThemeSwitch />
				</div>
			</Header>

			<Main fixed className='flex flex-col'>
				<div className='flex flex-col rounded-xl border p-4'>
					<p className='mb-4 text-sm text-muted-foreground text-center'>DE &lt;-&gt; EN</p>
					<FileUploadTable simulateUpload />
				</div>
			</Main>
		</>
	)
}
