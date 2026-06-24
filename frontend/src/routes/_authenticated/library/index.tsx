import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useDictionaryStore } from '@/stores/dictionary-store'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { Trash2Icon, SearchIcon, BookOpenIcon, Volume2Icon, CheckIcon, CopyIcon } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/library/')({
	component: LibraryDashboard,
})

function LibraryDashboard() {
	const { items, removeItem } = useDictionaryStore()
	const [searchQuery, setSearchQuery] = useState('')
	const [copiedId, setCopiedId] = useState<string | null>(null)

	const filteredItems = items.filter(
		(item) =>
			item.original.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.translated.toLowerCase().includes(searchQuery.toLowerCase())
	)

	const handleCopy = (id: string, text: string) => {
		navigator.clipboard.writeText(text)
		setCopiedId(id)
		setTimeout(() => setCopiedId(null), 2000)
	}

	const handleSpeak = (text: string, lang: string) => {
		const utterance = new SpeechSynthesisUtterance(text)
		utterance.lang = lang.startsWith('DE') ? 'de-DE' : 'en-US'
		window.speechSynthesis.speak(utterance)
	}

	return (
		<>
			<Header fixed>
				<div className='ms-auto flex items-center space-x-4'>
					<ThemeSwitch />
				</div>
			</Header>

			<Main fixed className='flex flex-col space-y-6 min-h-0'>
				<div className='flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0'>
					<div>
						<h1 className='text-2xl font-bold tracking-tight'>My Personal Dictionary</h1>
						<p className='text-sm text-muted-foreground'>
							Saved words and translations from your reading sessions.
						</p>
					</div>
					<div className='flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-1.5 border font-medium text-sm w-fit'>
						<BookOpenIcon className='size-4 text-primary' />
						<span>Total Words: {items.length}</span>
					</div>
				</div>

				<div className='relative w-full max-w-md'>
					<SearchIcon className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
					<input
						type='text'
						placeholder='Search saved words...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm'
					/>
				</div>

				{filteredItems.length > 0 ? (
					<div className='flex-1 overflow-auto min-h-0 rounded-xl border bg-card text-card-foreground shadow-sm'>
						<div className='flex flex-col divide-y divide-border overflow-y-auto max-h-[calc(100vh-280px)]'>
							{filteredItems.map((item) => (
								<div
									key={item.id}
									className='group flex flex-col p-4 space-y-2 hover:bg-muted/30 transition-colors'
								>
									<div className='flex items-start justify-between'>
										<div className='space-y-1'>
											<span className='inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider'>
												{item.language}
											</span>
											<h3 className='text-base font-semibold leading-none'>{item.original}</h3>
										</div>
										<div className='flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity'>
											<button
												onClick={() => handleSpeak(item.original, 'de-DE')}
												className='p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors'
												title='Listen (Original)'
											>
												<Volume2Icon className='size-3.5' />
											</button>
											<button
												onClick={() => handleCopy(item.id, item.original)}
												className='p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors'
												title='Copy'
											>
												{copiedId === item.id ? (
													<CheckIcon className='size-3.5 text-green-500' />
												) : (
													<CopyIcon className='size-3.5' />
												)}
											</button>
											<button
												onClick={() => removeItem(item.id)}
												className='p-1.5 hover:bg-muted rounded-md text-destructive hover:bg-destructive/10 transition-colors'
												title='Delete'
											>
												<Trash2Icon className='size-3.5' />
											</button>
										</div>
									</div>
									<p className='text-sm text-muted-foreground pl-4 border-l-2 border-primary/20 italic'>
										{item.translated}
									</p>
									<div className='text-[10px] text-muted-foreground/60 font-mono self-end'>
										{new Date(item.createdAt).toLocaleDateString()}
									</div>
								</div>
							))}
						</div>
					</div>
				) : (
					<div className='flex flex-1 flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 text-center max-w-md mx-auto w-full'>
						<BookOpenIcon className='size-12 text-muted-foreground/40 mb-4' />
						<h3 className='text-base font-semibold'>No words saved yet</h3>
						<p className='text-sm text-muted-foreground mt-1 mb-6'>
							Upload a PDF reader, hover to translate, and click a word region to add it to your dictionary.
						</p>
					</div>
				)}
			</Main>
		</>
	)
}
