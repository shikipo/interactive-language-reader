import path from 'path'

import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react-swc'

import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
	base: '/',
	plugins: [
		tanstackRouter({
			target: 'react',
			autoCodeSplitting: true,
		}),
		react(),
		tailwindcss(),
		svgr(),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		host: '127.0.0.1',
		port: 5173,
	},
})
