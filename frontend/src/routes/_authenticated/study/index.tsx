import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useDictionaryStore } from '@/stores/dictionary-store'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { BookOpenIcon, Volume2Icon } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/study/')({
	component: StudyDashboard,
})

function StudyDashboard() {
	const { items } = useDictionaryStore()
	const [randomCardIndex, setRandomCardIndex] = useState<number | null>(() => {
		return items.length > 0 ? Math.floor(Math.random() * items.length) : null
	})
	const [revealTranslation, setRevealTranslation] = useState(false)

	// Determine the actual card index to display, ensuring it is always in bounds
	const activeCardIndex = (randomCardIndex !== null && randomCardIndex < items.length)
		? randomCardIndex
		: (items.length > 0 ? 0 : null)

	const handleNextCard = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (items.length > 1) {
			let nextIndex = Math.floor(Math.random() * items.length)
			while (nextIndex === activeCardIndex) {
				nextIndex = Math.floor(Math.random() * items.length)
			}
			setRandomCardIndex(nextIndex)
		}
		setRevealTranslation(false)
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

			<Main fixed className='flex flex-col min-h-0'>
				<div className='flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 pb-4 border-b'>
					<div>
						<h1 className='text-2xl font-bold tracking-tight'>Study Cards Mode</h1>
						<p className='text-sm text-muted-foreground'>
							Review and practice the words you saved from your documents.
						</p>
					</div>
				</div>

				{items.length > 0 ? (
					<div className='flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-lg mx-auto w-full min-h-0 overflow-y-auto'>
						{activeCardIndex !== null && items[activeCardIndex] && (
							<div className='w-full space-y-6'>
								<div 
									onClick={() => setRevealTranslation(!revealTranslation)}
									className='w-full rounded-2xl border bg-card aspect-[1.618/1] p-8 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group/card'
								>
									<div className='absolute top-0 left-0 w-2 h-full bg-primary'></div>
									<div className='flex justify-between items-start text-xs text-muted-foreground font-mono'>
										<span className='uppercase tracking-wider font-semibold'>Review Card</span>
										<span className='bg-muted px-2 py-0.5 rounded uppercase font-bold text-primary/80'>
											{items[activeCardIndex].language}
										</span>
									</div>

									<div className='text-center space-y-4 py-4'>
										<p className='text-2xl font-extrabold tracking-tight'>
											{items[activeCardIndex].original}
										</p>
										
										{revealTranslation ? (
											<p className='text-base text-emerald-500 font-medium italic animate-fade-in pl-4 border-l-2 border-emerald-500/20 inline-block'>
												{items[activeCardIndex].translated}
											</p>
										) : (
											<p className='text-xs text-muted-foreground/50 select-none'>
												(Click card to reveal translation)
											</p>
										)}
									</div>

									<div className='flex justify-end'>
										<button 
											onClick={(e) => {
												e.stopPropagation()
												handleSpeak(items[activeCardIndex].original, 'de-DE')
											}}
											className='p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors'
											title='Listen'
										>
											<Volume2Icon className='size-5' />
										</button>
									</div>
								</div>

								<div className='flex items-center justify-between text-xs text-muted-foreground'>
									<span>Card {activeCardIndex + 1} of {items.length}</span>
									<button 
										onClick={handleNextCard}
										className='inline-flex items-center gap-1.5 px-4 py-2 font-semibold text-sm border rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors shadow-sm'
									>
										Next Card →
									</button>
								</div>
							</div>
						)}
					</div>
				) : (
					<div className='flex flex-1 flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 text-center max-w-md mx-auto w-full my-8'>
						<BookOpenIcon className='size-12 text-muted-foreground/40 mb-4 animate-pulse' />
						<h3 className='text-base font-semibold'>No words saved yet</h3>
						<p className='text-sm text-muted-foreground mt-1'>
							Go to Home, upload a PDF, and click word regions to save them in your dictionary.
						</p>
					</div>
				)}
			</Main>
		</>
	)
}
