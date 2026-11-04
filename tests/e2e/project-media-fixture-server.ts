import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { createServer, type ViteDevServer } from 'vite'

export async function startProjectMediaFixtureServer(): Promise<{
  origin: string
  close: () => Promise<void>
}> {
  const server: ViteDevServer = await createServer({
    configFile: false,
    root: process.cwd(),
    logLevel: 'error',
    plugins: [react()],
    resolve: {
      alias: [
        { find: '@', replacement: resolve(process.cwd(), 'src') },
        {
          find: /^next\/image$/,
          replacement: resolve(process.cwd(), 'tests/e2e/fixtures/next-image-fixture.tsx'),
        },
      ],
    },
    server: { host: '127.0.0.1', port: 0, strictPort: true },
  })

  await server.listen()
  const address = server.httpServer?.address()
  if (!address || typeof address === 'string') {
    await server.close()
    throw new Error('Vite did not expose an ephemeral address for the private media fixture')
  }

  return {
    origin: `http://127.0.0.1:${address.port}`,
    close: () => server.close(),
  }
}
