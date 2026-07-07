const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let win;
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const rootDir = path.join(__dirname, '..');

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'EqualReach Test Runner (DEMO)',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile(path.join(__dirname, 'index.html'));
});

function runTest(testFile) {
  return new Promise((resolve, reject) => {
    const proc = spawn(npx, [
      'playwright', 'test', testFile,
      '--headed',
      '--workers=1',
      '--reporter=allure-playwright',
    ], {
      cwd: rootDir,
      shell: true,
    });

    proc.stdout.on('data', (data) => {
      win.webContents.send('log', data.toString());
    });

    proc.stderr.on('data', (data) => {
      win.webContents.send('log', data.toString());
    });

    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${testFile} failed with code ${code}`));
    });
  });
}

function updateEnvPrName(prName) {
  const envPath = path.join(rootDir, '.env');
  let env = fs.readFileSync(envPath, 'utf-8');
  env = env.replace(/^PR_NAME=.*$/m, `PR_NAME=${prName}`);
  fs.writeFileSync(envPath, env, 'utf-8');
}

ipcMain.on('run-tests', async () => {
  const tests = [
    'smoke-tests/pr-creation.spec.ts',
    'smoke-tests/admin-matchmaking.spec.ts',
    'smoke-tests/dp-submission.spec.ts',
    'smoke-tests/proposal-signing.spec.ts',
    'smoke-tests/project-completion.spec.ts',
  ];

  try {
    for (const testFile of tests) {
      win.webContents.send('log', `\nRunning: ${testFile}\n`);
      await runTest(testFile);

      if (testFile.includes('pr-creation')) {
        const prNamePath = path.join(rootDir, 'pr-name.txt');
        if (fs.existsSync(prNamePath)) {
          const prName = fs.readFileSync(prNamePath, 'utf-8').trim();
          updateEnvPrName(prName);
          win.webContents.send('log', `\nPR_NAME updated: ${prName}\n`);
          process.env.PR_NAME = prName;
        }
      }
    }
    win.webContents.send('done', 0);
  } catch (err) {
    win.webContents.send('log', `\nError: ${err.message}\n`);
    win.webContents.send('done', 1);
  }
});

ipcMain.on('open-report', () => {
  win.webContents.send('log', '\nGenerating Allure report...\n');

  const generate = spawn(npx, [
    'allure', 'generate', 'allure-results',
    '--clean', '-o', 'allure-report',
  ], {
    cwd: rootDir,
    shell: true,
  });

  generate.stdout.on('data', (data) => {
    win.webContents.send('log', data.toString());
  });

  generate.stderr.on('data', (data) => {
    win.webContents.send('log', data.toString());
  });

  generate.on('close', (code) => {
    if (code !== 0) {
      win.webContents.send('log', '\nFailed to generate report.\n');
      return;
    }
    win.webContents.send('log', '\nOpening report in browser...\n');
    const open = spawn(npx, ['allure', 'open', 'allure-report'], {
      cwd: rootDir,
      shell: true,
      detached: true,
    });
    open.stdout.on('data', (data) => {
      win.webContents.send('log', data.toString());
    });
    open.stderr.on('data', (data) => {
      win.webContents.send('log', data.toString());
    });
  });
});