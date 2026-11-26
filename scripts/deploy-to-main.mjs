import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const repoRoot = process.cwd()
const distDir = path.join(repoRoot, 'dist')
const distIndex = path.join(distDir, 'index.html')

if (!fs.existsSync(distIndex)) {
  console.error('Error: dist/index.html not found. Run npm run build first.')
  process.exit(1)
}

function runGit(args, cwd = repoRoot) {
  return execFileSync('git', args, {
    cwd,
    stdio: 'pipe',
    encoding: 'utf-8',
  }).trim()
}

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gh-pages-deploy-'))
console.log(`Staging GitHub Pages bundle in temporary worktree: ${tmpDir}`)

try {
  runGit(['worktree', 'add', tmpDir, 'main'])

  for (const entry of fs.readdirSync(tmpDir)) {
    if (entry === '.git') continue
    fs.rmSync(path.join(tmpDir, entry), { recursive: true, force: true })
  }

  fs.cpSync(distDir, tmpDir, { recursive: true })
  fs.writeFileSync(path.join(tmpDir, '.nojekyll'), '')
  fs.writeFileSync(
    path.join(tmpDir, 'README.md'),
    [
      '# Michael Hans Magbojos — Portfolio',
      '',
      'Compiled production bundle served at https://michaelhans32116.github.io/.',
      '',
      'Source code (React + TypeScript + Vite) lives on the `redesign/yugioh-duelist` branch.',
      '',
    ].join('\n'),
  )

  runGit(['add', '-A'], tmpDir)
  const pending = runGit(['status', '--porcelain'], tmpDir)

  if (!pending) {
    console.log('No bundle changes detected on main.')
  } else {
    const commitMsg = 'deploy: publish compiled portfolio bundle to GitHub Pages'
    console.log(runGit(['commit', '-m', commitMsg], tmpDir))
  }

  console.log('Pushing main to origin...')
  const pushOut = execFileSync('git', ['push', 'origin', 'main'], {
    cwd: tmpDir,
    stdio: 'inherit',
  })
  void pushOut
  const deployedSha = runGit(['rev-parse', '--short', 'HEAD'], tmpDir)
  console.log(`DEPLOYED_MAIN_SHA=${deployedSha}`)
} finally {
  try {
    runGit(['worktree', 'remove', '--force', tmpDir])
  } catch {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
}
