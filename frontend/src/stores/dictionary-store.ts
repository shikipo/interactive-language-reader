import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DictionaryItem {
	id: string
	original: string
	translated: string
	context?: string
	language: string
	createdAt: string
}

interface DictionaryState {
	items: DictionaryItem[]
	addItem: (item: Omit<DictionaryItem, 'id' | 'createdAt'>) => void
	removeItem: (id: string) => void
	hasItem: (original: string) => boolean
}

export const useDictionaryStore = create<DictionaryState>()(
	persist(
		(set, get) => ({
			items: [],
			addItem: (item) => {
				const exists = get().items.some(
					(i) => i.original.toLowerCase().trim() === item.original.toLowerCase().trim()
				)
				if (exists) return

				const newItem: DictionaryItem = {
					...item,
					id: Math.random().toString(36).substring(2, 9),
					createdAt: new Date().toISOString(),
				}
				set((state) => ({ items: [newItem, ...state.items] }))
			},
			removeItem: (id) => {
				set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
			},
			hasItem: (original) => {
				return get().items.some(
					(i) => i.original.toLowerCase().trim() === original.toLowerCase().trim()
				)
			},
		}),
		{
			name: 'lingua-pdf-dictionary',
		}
	)
)
