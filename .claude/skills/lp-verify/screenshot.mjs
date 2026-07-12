#!/usr/bin/env node
// LP検証用スクリーンショットスクリプト
// 使い方: node .claude/skills/lp-verify/screenshot.mjs [htmlファイル] [出力ディレクトリ]
//   例:   node .claude/skills/lp-verify/screenshot.mjs index.html /tmp/lp-shots
// デスクトップ(1280px)とモバイル(390px)のフルページPNGを出力する。

import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const htmlFile = resolve(process.argv[2] ?? 'index.html');
const outDir = resolve(process.argv[3] ?? 'lp-screenshots');

if (!existsSync(htmlFile)) {
  console.error(`HTMLファイルが見つかりません: ${htmlFile}`);
  process.exit(1);
}

// リモート実行環境では /opt/pw-browsers/chromium にプリインストール済み。
// ローカルでは playwright 標準の解決に任せる。
function chromiumExecutable() {
  const candidates = [
    process.env.CHROMIUM_PATH,
    '/opt/pw-browsers/chromium',
  ].filter(Boolean);
  for (const c of candidates) if (existsSync(c)) return c;
  return undefined;
}

const { chromium } = await import('playwright-core').catch(() => import('playwright'));

const viewports = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
];

await mkdir(outDir, { recursive: true });

const executablePath = chromiumExecutable();
const browser = await chromium.launch(executablePath ? { executablePath } : {});

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'networkidle', timeout: 30000 })
    .catch(() => page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'load', timeout: 30000 }));
  // スクロール連動アニメーション(IntersectionObserver)を全セクションで発火させてから撮影する
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
  const out = `${outDir}/${vp.name}-full.png`;
  await page.screenshot({ path: out, fullPage: true });
  console.log(`saved: ${out}`);
  await page.close();
}

await browser.close();
