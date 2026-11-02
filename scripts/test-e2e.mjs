import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { once } from 'node:events'
import { resolve } from 'node:path'

const configuredBaseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000'
const baseUrl = new URL(configuredBaseUrl).origin
const serverUrl = new URL(baseUrl)
const hostname = serverUrl.hostname
const port = serverUrl.port || '80'
const buildId = resolve('.next/BUILD_ID')
let server
let runner

async function isServerReady() {
  try {
    const response = await fetch(baseUrl)
    if (!response.ok) return false
    const html = await response.text()
    return ['id="hero-title"', 'id="about"', 'id="portfolio"', 'id="contact"'].every((marker) =>
      html.includes(marker),
    )
  } catch {
    return false
  }
}

async function stopServer() {
  if (!server || server.exitCode !== null) return
  server.kill('SIGTERM')
  await once(server, 'exit')
}

async function waitForServer() {
  const deadline = Date.now() + 60_000
  while (Date.now() < deadline) {
    if (await isServerReady()) return
    if (server?.exitCode !== null && server?.exitCode !== undefined) {
      throw new Error(`Next.js production server exited with code ${server.exitCode}.`)
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 250))
  }
  throw new Error('Timed out waiting for the Next.js production server at ' + baseUrl)
}

async function main() {
  if (!(await isServerReady())) {
    if (!existsSync(buildId)) {
      throw new Error('No production build found. Run "npm run build" before "npm run test:e2e".')
    }

    server = spawn(
      process.execPath,
      ['node_modules/next/dist/bin/next', 'start', '--hostname', hostname, '--port', port],
      { stdio: 'inherit' },
    )
    server.once('error', (error) => console.error('Could not start Next.js:', error))
    await waitForServer()
  }

  runner = spawn(
    process.execPath,
    ['node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(2)],
    { stdio: 'inherit', env: process.env },
  )

  const [code] = await once(runner, 'close')
  await stopServer()
  process.exitCode = code ?? 1
}

process.once('SIGINT', () => {
  runner?.kill('SIGINT')
  server?.kill('SIGTERM')
})

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error)
  await stopServer()
  process.exitCode = 1
})
