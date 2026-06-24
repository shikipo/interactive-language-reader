import { create } from 'zustand'

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

export type LanguageDirection = 'DE-EN' | 'EN-DE'

export const LANGUAGE_DIRECTIONS = {
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

export type Status = 'idle' | 'uploading' | 'error' | 'done'

interface ReaderState {
	status: Status
	uploadProgress: number
	uploadError: string | null
	pdfFile: File | null
	pageRegions: PdfPageRegions[]
	sessionId: string | null
	direction: LanguageDirection
	activeLanguages: typeof LANGUAGE_DIRECTIONS[LanguageDirection]

	setStatus: (status: Status) => void
	setUploadProgress: (progress: number) => void
	setUploadError: (error: string | null) => void
	setPdfFile: (file: File | null) => void
	setPageRegions: (regions: PdfPageRegions[]) => void
	setSessionId: (sessionId: string | null) => void
	setDirection: (direction: LanguageDirection) => void
	setActiveLanguages: (languages: typeof LANGUAGE_DIRECTIONS[LanguageDirection]) => void
	reset: () => void
}

export const useReaderStore = create<ReaderState>((set) => ({
	status: 'idle',
	uploadProgress: 0,
	uploadError: null,
	pdfFile: null,
	pageRegions: [],
	sessionId: null,
	direction: 'DE-EN',
	activeLanguages: LANGUAGE_DIRECTIONS['DE-EN'],

	setStatus: (status) => set({ status }),
	setUploadProgress: (uploadProgress) => set({ uploadProgress }),
	setUploadError: (uploadError) => set({ uploadError }),
	setPdfFile: (pdfFile) => set({ pdfFile }),
	setPageRegions: (pageRegions) => set({ pageRegions }),
	setSessionId: (sessionId) => set({ sessionId }),
	setDirection: (direction) => set({ direction }),
	setActiveLanguages: (activeLanguages) => set({ activeLanguages }),
	reset: () => set({
		status: 'idle',
		uploadProgress: 0,
		uploadError: null,
		pdfFile: null,
		pageRegions: [],
		sessionId: null,
	}),
}))
