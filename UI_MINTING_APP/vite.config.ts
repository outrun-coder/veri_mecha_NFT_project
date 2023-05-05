import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	ssr: {
		noExternal: ['@popperjs/core']
	},
	resolve: {
		alias: {
			'services': path.resolve('./src/services'),
			'components': path.resolve('./src/components')
		}
	}
});
