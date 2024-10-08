import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({ 
    insertTypesEntry: true,
    tsconfigPath: "tsconfig.json",
    include: ["./lib/**"],
  })],
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'Utils-zsf',
      fileName: 'index',
    }
  }
})
