import { defineConfig } from "vite";

export default defineConfig({
	build: {
		// embed loader entry
		lib: {
			entry: "src/main.js",
			formats: ["es"],
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
