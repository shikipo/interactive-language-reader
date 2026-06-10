import { create } from 'zustand'

// User metadata interface
interface UserMetadata {
	avatar_url?: string
	picture?: string
	email?: string
	email_verified?: boolean
	name?: string
	uname?: string
	usurname?: string
	gender?: string
	company?: string
	phone_number?: string
	communication_language?: string
	[key: string]: any
}

// Auth user interface
interface AuthUser {
	id: string
	metadata: UserMetadata
}

// Auth state interface
interface AuthState {
	auth: {
		user: AuthUser | null
		accessToken: string | null
		refreshToken: string | null
		isHydrated: boolean

		initializeSession: (
			id: string,
			metadata: UserMetadata,
			accessToken: string,
			refreshToken: string
		) => void
		setTokens: (accessToken: string, refreshToken: string) => void
		setUser: (id: string, metadata: UserMetadata) => void
		setHydrated: (status: boolean) => void
		getMetadata: () => UserMetadata
		reset: () => void
	}
}

export const useAuthStore = create<AuthState>()((set, get) => ({
	auth: {
		user: null,
		accessToken: null,
		refreshToken: null,
		isHydrated: false,

		initializeSession: (id, metadata, accessToken, refreshToken) =>
			set((state) => ({
				...state,
				auth: {
					...state.auth,
					user: id ? { id, metadata } : state.auth.user,
					accessToken,
					refreshToken,
					isHydrated: true,
				},
			})),

		setTokens: (accessToken, refreshToken) =>
			set((state) => ({
				...state,
				auth: {
					...state.auth,
					accessToken,
					refreshToken,
					user: state.auth.user ? { ...state.auth.user } : state.auth.user,
				},
			})),

		setUser: (id, metadata) =>
			set((state) => ({
				...state,
				auth: {
					...state.auth,
					user: { id, metadata },
					accessToken: state.auth.accessToken,
					refreshToken: state.auth.refreshToken,
				},
			})),

		setHydrated: (status) =>
			set((state) => ({
				...state,
				auth: { ...state.auth, isHydrated: status },
			})),

		getMetadata: () => {
			const raw = get().auth.user?.metadata || {}
			return Object.fromEntries(
				Object.entries(raw).filter(([_, value]) => value != null)
			) as UserMetadata
		},

		reset: () =>
			set((state) => ({
				...state,
				auth: {
					user: null,
					accessToken: null,
					refreshToken: null,
					isHydrated: false,
					initializeSession: state.auth.initializeSession,
					setTokens: state.auth.setTokens,
					setUser: state.auth.setUser,
					setHydrated: state.auth.setHydrated,
					getMetadata: state.auth.getMetadata,
					reset: state.auth.reset,
				},
			})),
	},
}))
