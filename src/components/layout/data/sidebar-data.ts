import { HelpCircle, House, LibraryBig, Settings } from 'lucide-react'

import { type NavGroup } from '../types'

export const sidebarData: NavGroup[] = [
	{
		title: 'General',
		items: [
			{
				title: 'Home',
				url: '/',
				icon: House,
			},
			{
				title: 'Library',
				url: '/library',
				icon: LibraryBig,
			},
		],
	},
	{
		title: 'Other',
		items: [
			{
				title: 'Settings',
				url: '/settings',
				icon: Settings,
			},
			{
				title: 'Help',
				url: '/help',
				icon: HelpCircle,
			},
		],
	},
]
