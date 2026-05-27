import { useAuthStore } from '@/stores/auth-store'

import { ConfirmDialog } from '@/components/confirm-dialog'

interface SignOutDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
	const { auth } = useAuthStore()

	const handleSignOut = () => {
		auth.reset()
		onOpenChange(false)
	}

	return (
		<ConfirmDialog
			open={open}
			onOpenChange={onOpenChange}
			title='Sign out'
			desc='Are you sure you want to sign out?'
			confirmText='Sign out'
			destructive
			handleConfirm={handleSignOut}
			className='sm:max-w-sm'
		/>
	)
}
