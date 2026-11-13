import { defineConfig } from '@hey-api/openapi-ts'

// Input defaults to the backend export committed in this monorepo.
// Override with OPENAPI_INPUT (path or URL) to generate from another spec.
export default defineConfig({
  input: process.env.OPENAPI_INPUT ?? '../backend/docs/openapi/openapi.json',
  output: process.env.OPENAPI_OUTPUT ?? 'src/api/generated',
  plugins: [
    '@hey-api/typescript',
    {
      name: '@hey-api/client-axios',
      runtimeConfigPath: './src/lib/api-client.ts',
    },
    '@hey-api/sdk',
    {
      name: 'zod',
      compatibilityVersion: 4,
      requests: true,
      responses: true,
      definitions: true,
    },
    '@tanstack/react-query',
  ],
})
