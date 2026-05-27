import { BookOpen } from 'lucide-react'

import { useLayout } from '@/context/layout-provider'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '@/components/ui/sidebar'

import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'

export function AppSidebar() {
	const { collapsible, variant } = useLayout()
	return (
		<Sidebar collapsible={collapsible} variant={variant}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size='lg' asChild>
							<div className='flex items-center gap-2'>
								<div className='flex aspect-square size-8 items-center justify-center text-sidebar-primary'>
									<BookOpen className='size-6' />
								</div>
								<span className='font-medium'>LinguaPDF</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				{sidebarData.map((props) => (
					<NavGroup key={props.title} {...props} />
				))}
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
