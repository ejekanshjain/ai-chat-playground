// @ts-ignore
import nextVitals from 'eslint-config-next/core-web-vitals'
// import nextTs from 'eslint-config-next/typescript'
import { defineConfig, globalIgnores } from 'eslint/config'

const eslintConfig = defineConfig([
  ...nextVitals,
  // ...nextTs,
  globalIgnores([
    'node_modules/**',
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts'
  ]),
  {
    rules: {
      'react/no-unescaped-entities': 'off'
    }
  }
])

export default eslintConfig
