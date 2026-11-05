import { execFileSync, spawn, type ChildProcess } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import net from 'node:net'
import path from 'node:path'
import { expect, test } from '@playwright/test'

const repositoryRoot = process.cwd()
const fixtureRoot = path.join(repositoryRoot, 'tests/e2e/fixtures/contact-publication-next')
const nextCli = path.join(repositoryRoot, 'node_modules/next/dist/bin/next')
const forbidden = [
  'SENTINEL_VERIFIED_UNAPPROVED_EMAIL',
  'SENTINEL_UNVERIFIED_APPROVED_EMAIL',
  'SENTINEL_UNVERIFIED_UNAPPROVED_EMAIL',
  'SENTINEL_DRAFT_RECORD_EMAIL',
  'SENTINEL_DRAFT_RECORD_OWNER',
  'SENTINEL_PRIVATE_APPROVAL_METADATA',
  'SENTINEL_UNAPPROVED_OWNER_NAME',
  'SENTINEL_PRIVATE_PROVENANCE',
]
const records = {
  verifiedApproved: record(
    'approved',
    field('SENTINEL_PUBLIC_APPROVED_EMAIL', 'verified', 'approved'),
    field('SENTINEL_PUBLIC_APPROVED_OWNER', 'verified', 'approved'),
  ),
  verifiedUnapproved: record('approved', field(forbidden[0], 'verified', 'unapproved')),
  unverifiedApproved: record('approved', field(forbidden[1], 'unverified', 'approved')),
  unverifiedUnapproved: record('approved', field(forbidden[2], 'unverified', 'unapproved')),
  recordUnapproved: {
    ...record(
      'draft',
      field(forbidden[3], 'verified', 'approved'),
      field(forbidden[4], 'verified', 'approved'),
    ),
    reviewNote: forbidden[5],
  },
  ownerUnapproved: record(
    'approved',
    field('SENTINEL_PUBLIC_APPROVED_EMAIL', 'verified', 'approved'),
    field(forbidden[6], 'verified', 'unapproved'),
  ),
}

function field(value: string, verificationStatus: string, publicationStatus: string) {
  return {
    value,
    verification: {
      status: verificationStatus,
      source: 'owner-confirmed',
      internalProvenance: forbidden[7],
    },
    publication: { status: publicationStatus },
    internalApprovalNote: forbidden[5],
  }
}

function record(
  publicationStatus: string,
  email: ReturnType<typeof field>,
  ownerName = field('Casian Criste', 'verified', 'approved'),
) {
  return {
    id: 'portfolio-owner-contact',
    publicationStatus,
    fields: {
      ownerName,
      email,
      githubUrl: field('', 'unverified', 'unapproved'),
      linkedinUrl: field('', 'unverified', 'unapproved'),
    },
  }
}

async function availablePort(): Promise<number> {
  const server = net.createServer()
  server.listen(0, '127.0.0.1')
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve)
    server.once('error', reject)
  })
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Unable to allocate fixture port')
  const port = address.port
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  )
  return port
}

async function waitForServer(origin: string, child: ChildProcess): Promise<void> {
  const deadline = Date.now() + 60_000
  while (Date.now() < deadline) {
    if (child.exitCode !== null)
      throw new Error(`Publication fixture exited with ${child.exitCode}`)
    try {
      if ((await fetch(origin)).ok) return
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }
  throw new Error('Timed out waiting for the isolated publication fixture')
}

async function scanGeneratedFixtureAssets(): Promise<void> {
  async function visit(directory: string): Promise<void> {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name)
      if (entry.isDirectory()) await visit(target)
      else {
        const contents = await readFile(target)
        const text = contents.toString('utf8')
        for (const sentinel of [...forbidden, 'SENTINEL_PUBLIC_APPROVED_EMAIL']) {
          expect(text, `fixture build artifact ${target}`).not.toContain(sentinel)
        }
      }
    }
  }
  await visit(path.join(fixtureRoot, '.next'))
}

async function scanProductionArtifacts(): Promise<void> {
  const forbiddenValues = [...forbidden, 'SENTINEL_PUBLIC_APPROVED_EMAIL']
  for (const directory of ['.next/server/app', '.next/static']) {
    async function visit(targetDirectory: string): Promise<void> {
      for (const entry of await readdir(targetDirectory, { withFileTypes: true })) {
        const target = path.join(targetDirectory, entry.name)
        if (entry.isDirectory()) await visit(target)
        else {
          const output = (await readFile(target)).toString('utf8')
          for (const value of forbiddenValues) {
            expect(output, `production artifact ${target}`).not.toContain(value)
          }
        }
      }
    }
    await visit(path.join(repositoryRoot, directory))
  }
  const routeManifest = (
    await readFile(path.join(repositoryRoot, '.next/app-path-routes-manifest.json'))
  ).toString('utf8')
  expect(routeManifest).not.toContain('test-publication-boundary')
}

test.describe('contact publication boundary in an isolated Next.js app', () => {
  let origin: string
  let server: ChildProcess | undefined
  test.setTimeout(180_000)

  test.beforeAll(async () => {
    const env = { ...process.env, PORTFOLIO_REPO_ROOT: repositoryRoot }
    execFileSync(process.execPath, [nextCli, 'build', fixtureRoot], {
      cwd: repositoryRoot,
      env,
      stdio: 'pipe',
      timeout: 150_000,
    })
    await scanGeneratedFixtureAssets()

    const port = await availablePort()
    origin = `http://127.0.0.1:${port}`
    server = spawn(
      process.execPath,
      [nextCli, 'start', fixtureRoot, '--hostname', '127.0.0.1', '--port', String(port)],
      {
        cwd: repositoryRoot,
        env: {
          ...env,
          PORT: String(port),
          HOSTNAME: '127.0.0.1',
          CONTACT_PUBLICATION_FIXTURE_RECORDS: JSON.stringify(records),
        },
        stdio: 'ignore',
      },
    )
    await waitForServer(origin, server)
  })

  test.afterAll(async () => {
    if (!server || server.exitCode !== null) return
    server.kill('SIGTERM')
    await new Promise<void>((resolve) => server?.once('exit', () => resolve()))
  })

  test('renders eligible data only through the real public projection and Server Components', async ({
    page,
  }) => {
    const flightResponses: string[] = []
    await page.route('**/test-publication-boundary**', async (route) => {
      const response = await route.fetch()
      if ((response.headers()['content-type'] ?? '').includes('text/x-component')) {
        flightResponses.push(await response.text())
      }
      await route.fulfill({ response })
    })

    const directResponse = await page.request.get(`${origin}/test-publication-boundary`)
    expect(directResponse.status()).toBe(200)
    const directHtml = await directResponse.text()
    expect(directHtml).toContain('SENTINEL_PUBLIC_APPROVED_EMAIL')
    expect(directHtml).toContain('SENTINEL_PUBLIC_APPROVED_OWNER')
    for (const sentinel of forbidden) expect(directHtml).not.toContain(sentinel)
    expect(directHtml).not.toContain('owner-confirmed')
    expect(directHtml).not.toContain('publicationStatus')

    await page.goto(origin)
    await page.getByRole('link', { name: 'Run publication fixture' }).click()
    await expect(page.getByRole('heading', { name: 'Publication boundary fixture' })).toBeVisible()

    const html = await page.content()
    expect(html).toContain('SENTINEL_PUBLIC_APPROVED_EMAIL')
    expect(html).toContain('SENTINEL_PUBLIC_APPROVED_OWNER')
    for (const sentinel of forbidden) expect(html).not.toContain(sentinel)
    expect(html).not.toContain('owner-confirmed')
    expect(html).not.toContain('publicationStatus')
    const ownerUnapprovedFooter = page.locator('[data-fixture-case="ownerUnapproved"] .site-footer')
    await expect(ownerUnapprovedFooter).toContainText(/©\s*\d{4}\. All rights reserved\./)
    await expect(ownerUnapprovedFooter).not.toContainText(forbidden[6])

    await expect.poll(() => flightResponses.length).toBeGreaterThan(0)
    for (const payload of flightResponses) {
      for (const sentinel of forbidden) expect(payload).not.toContain(sentinel)
      expect(payload).not.toContain('SENTINEL_PRIVATE_APPROVAL_METADATA')
    }
  })
})

test('normal production output contains no private test sentinels', async () => {
  await scanProductionArtifacts()
})
