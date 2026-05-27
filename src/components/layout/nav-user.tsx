import { Link } from '@tanstack/react-router'

import { Bell, ChevronsUpDown, LogOut, Settings } from 'lucide-react'

import { useAuthStore } from '@/stores/auth-store'

import useDialogState from '@/hooks/use-dialog-state'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar'

import { SignOutDialog } from '@/components/sign-out-dialog'

const DEFAULT_USER_METADATA = {
	email: 'account@example.com',
	uname: 'account',
	usurname: '',
	avatar_url: '',
	picture: '',
}

export function NavUser() {
	const { isMobile } = useSidebar()
	const [open, setOpen] = useDialogState()
	const { auth } = useAuthStore()

	// Load stored user metadata from the local store
	const storedUserMetadata = auth.getMetadata()

	// Parse Fullname into Name and Surname
	const fullName = storedUserMetadata.name || ''
	const [parsedName, ...surnameParts] = fullName.trim().split(' ')
	const parsedSurname = surnameParts.join(' ')

	// Merge with defaults
	const metadata = {
		...DEFAULT_USER_METADATA,
		...storedUserMetadata,
		uname: storedUserMetadata.uname || parsedName || '',
		usurname: storedUserMetadata.usurname || parsedSurname || '',
	}

	const userFullName = `${metadata.uname} ${metadata.usurname}`.trim()
	const userInitials =
		(metadata.uname?.[0] || 'A') + (metadata.usurname?.[0] || '')
	const userEmail = metadata.email

	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size='lg'
								className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
							>
								<Avatar className='h-8 w-8 rounded-lg'>
									<AvatarImage
										src={metadata.avatar_url || metadata.picture}
										alt={userFullName}
									/>
									<AvatarFallback>{userInitials.toUpperCase()}</AvatarFallback>
								</Avatar>
								<div className='grid flex-1 text-start text-sm leading-tight'>
									<span className='truncate font-semibold'>{userFullName}</span>
									<span className='truncate text-xs text-muted-foreground'>
										{userEmail.toLowerCase()}
									</span>
								</div>
								<ChevronsUpDown className='ms-auto size-4' />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
							side={isMobile ? 'bottom' : 'right'}
							align='end'
							sideOffset={4}
						>
							<DropdownMenuLabel className='p-0 font-normal'>
								<div className='flex items-center gap-2 px-1 py-1.5 text-start text-sm'>
									<Avatar className='h-8 w-8 rounded-lg'>
										<AvatarImage
											src={metadata.avatar_url || metadata.picture}
											alt={userFullName}
										/>
										<AvatarFallback>
											{userInitials.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className='grid flex-1 text-start text-sm leading-tight'>
										<span className='truncate font-semibold'>
											{userFullName}
										</span>
										<span className='truncate text-xs text-muted-foreground'>
											{userEmail}
										</span>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem asChild></DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link to='/settings'>
										<Settings />
										Settings
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link to='/settings/notifications'>
										<Bell />
										Notifications
									</Link>
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								variant='destructive'
								onClick={() => setOpen(true)}
							>
								<LogOut />
								Sign out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
			<SignOutDialog open={!!open} onOpenChange={setOpen} />
		</>
	)
}
