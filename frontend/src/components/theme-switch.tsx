import { type MouseEvent, useEffect } from 'react'

import { Moon02Icon, Sun03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { useTheme } from '@/context/theme-provider'

import { Button } from '@/components/ui/button'

export function ThemeSwitch() {
	const { resolvedTheme, setTheme } = useTheme()
	const isDark = resolvedTheme === 'dark'

	/* Update theme-color meta tag
	 * when theme is updated */
	useEffect(() => {
		const themeColor = isDark ? '#020817' : '#fff'
		const metaThemeColor = document.querySelector("meta[name='theme-color']")
		if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor)
	}, [isDark])

	const toggleTheme = (e: MouseEvent<HTMLButtonElement>) => {
		const x = e.clientX
		const y = e.clientY
		const endRadius = Math.hypot(
			Math.max(x, window.innerWidth - x),
			Math.max(y, window.innerHeight - y)
		)

		// Fallback for browsers without View Transition API
		if (!document.startViewTransition) {
			setTheme(isDark ? 'light' : 'dark')
			return
		}

		const transition = document.startViewTransition(() => {
			setTheme(isDark ? 'light' : 'dark')
		})

		transition.ready.then(() => {
			document.documentElement.animate(
				{
					clipPath: [
						`circle(0px at ${x}px ${y}px)`,
						`circle(${endRadius}px at ${x}px ${y}px)`,
					],
				},
				{
					duration: 500,
					easing: 'ease-in-out',
					pseudoElement: '::view-transition-new(root)',
				}
			)
		})
	}

	return (
		<Button
			variant='ghost'
			size='icon'
			className='scale-95 rounded-full'
			onClick={toggleTheme}
			aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
		>
			<HugeiconsIcon icon={Sun03Icon} strokeWidth={2} color='currentColor' className='size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
			<HugeiconsIcon icon={Moon02Icon} strokeWidth={2} color='currentColor' className='absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
		</Button>
	)
}
