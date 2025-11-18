import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite'


// Clear and explicit Vite config.
// - Dev server serves index.html with HMR.
// - Build emits a library in ESM + UMD so publishers can <script src=...>.
export default defineConfig({
	plugins: [preact(), tailwindcss()],
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
