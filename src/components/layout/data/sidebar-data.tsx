import { HelpCircleIcon, Home08Icon, LibraryIcon, Settings01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { type NavGroup } from '../types'

const icon = (i: Parameters<typeof HugeiconsIcon>[0]['icon']) => () => (
	<HugeiconsIcon icon={i} size={24} color='currentColor' strokeWidth={2} />
)

export const sidebarData: NavGroup[] = [
	{
		title: 'General',
		items: [
			{
				title: 'Home',
				url: '/',
				icon: icon(Home08Icon),
			},
			{
				title: 'Library',
				url: '/library',
				icon: icon(LibraryIcon),
			},
		],
	},
	{
		title: 'Other',
		items: [
			{
				title: 'Settings',
				url: '/settings',
				icon: icon(Settings01Icon),
			},
			{
				title: 'Help',
				url: '/help',
				icon: icon(HelpCircleIcon),
			},
		],
	},
]
