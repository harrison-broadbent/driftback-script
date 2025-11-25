import { defineConfig } from "vite";

export default defineConfig({
	define: {
		__DRIFTBACK_ORIGIN__: JSON.stringify("https://driftback.app"),
	},
	build: {
		// embed loader entry
		lib: {
			entry: "src/main.js",
			name: "Driftback",            			// only used for IIFE format
			formats: ["iife"],                  // single self-executing bundle. Better for CORS
			fileName: () => "db.js",
		},

		outDir: "dist-embed",
		emptyOutDir: true,
		minify: "esbuild",

		// force a single output file (no code-splitting)
		rollupOptions: {
			output: {
				inlineDynamicImports: true,
				manualChunks: undefined,
			},
		},

		// just in case CSS ever gets pulled in via imports
		cssCodeSplit: false,
	},
});
