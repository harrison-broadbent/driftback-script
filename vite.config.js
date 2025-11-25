import { defineConfig } from 'vite';

import tailwindcss from '@tailwindcss/vite'


// Clear and explicit Vite config.
// - Dev server serves index.html with HMR.
// - Build emits a library in ESM + UMD so publishers can <script src=...>.
export default defineConfig({
	define: {
		__DRIFTBACK_ORIGIN__: JSON.stringify("http://localhost:3001"),
	},
	plugins: [tailwindcss()],
	server: { open: true },
	build: {
		lib: { entry: 'src/main.js', name: 'DriftbackEmbed', formats: ['es', 'umd'] },
		rollupOptions: {
			output: {
				inlineDynamicImports: true
			}
		},
		sourcemap: true,
		minify: 'esbuild'
	}
});
