import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // Entry point
  format: ["cjs", "esm"], // Output both CommonJS and ESM
  dts: true, // Generate TypeScript types
  splitting: false, // Disable code splitting
  sourcemap: true, // Generate source maps
  clean: true, // Remove old files before build
  minify: true, // Minify output
  shims: true, // Add Node.js shims (optional)
  outDir: "dist", // Output directory
  bundle: true, // ✅ Bundle all dependencies
  //   noExternal: [/(.*)/],
});
