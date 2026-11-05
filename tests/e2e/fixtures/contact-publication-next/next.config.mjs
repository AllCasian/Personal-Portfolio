import path from 'node:path'
import process from 'node:process'

const repositoryRoot = process.env.PORTFOLIO_REPO_ROOT ?? path.resolve('../../../../')

export default {
  distDir: '.next',
  turbopack: { root: repositoryRoot },
}
