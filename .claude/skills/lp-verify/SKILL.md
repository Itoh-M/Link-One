---
name: lp-verify
description: >-
  LinkOne LP (index.html) の編集後レンダリング検証を行うスキル。CLAUDE.md の編集ワークフロー
  手順3「Chromium（Playwright）でレンダリングし、スクリーンショットで確認する」を実行するとき、
  「LPを確認して」「スクショを撮って」「表示崩れがないか見て」「編集結果を検証して」という依頼が
  出たとき、または index.html を変更したあとのコミット前チェックとして必ず使う。
  デスクトップ(1280px)とモバイル(390px)のフルページスクリーンショットを生成し、目視確認する。
---

# LP レンダリング検証（lp-verify）

`index.html` の変更をコミットする前に、実際にレンダリングして表示崩れがないことを確認します。

## 手順

### 1. スクリーンショットを撮る

```bash
cd /home/user/Link-One
npm ls playwright-core >/dev/null 2>&1 || npm i --no-save playwright-core >/dev/null 2>&1
node .claude/skills/lp-verify/screenshot.mjs index.html /tmp/lp-shots
```

- リモート実行環境ではChromiumが `/opt/pw-browsers/chromium` にプリインストール済み
  （`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` のためブラウザの再取得は起きない）。
- `playwright install` は実行しないこと。

### 2. Readツールで画像を開いて目視確認する

`/tmp/lp-shots/desktop-full.png` と `/tmp/lp-shots/mobile-full.png` を確認する。

チェック観点:
- 変更したセクションが意図どおりに表示されているか
- 他セクションへの巻き込み崩れ（レイアウト・重なり・余白）がないか
- モバイル幅(390px)でのオーバーフロー・改行崩れがないか

### 3. 既知の欠落（リモート環境では正常）

以下はこの実行環境に外部依存が無いための欠落で、**本番では正常に表示される**。
崩れと誤認しないこと（CLAUDE.md参照）:
- Google Fonts（代替フォントで描画される）
- 本番WPアップロード上の世界地図画像
- Instagram埋め込み

### 4. 変更前後の比較が必要な場合

```bash
git stash && node .claude/skills/lp-verify/screenshot.mjs index.html /tmp/lp-shots-before && git stash pop
node .claude/skills/lp-verify/screenshot.mjs index.html /tmp/lp-shots-after
```

before/after を並べて確認し、意図した差分だけであることを確かめる。

## 注意

- このスキルは検証のみ。`index.html` 以外を編集しない（`brand/original.html` は編集禁止）。
- スクリーンショットはユーザーへの報告時に `SendUserFile` で共有すると確認が早い。
