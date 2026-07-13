# LinkOne LP 引継ぎ書

最終更新: 2026-07-11 / 基準コミット: `a1f4aa3`(main 最新)

本書は、LinkOne 公式LP( https://link-one.co.jp/ )のリポジトリ **Itoh-M/Link-One** を引き継ぐための資料です。
リポジトリの現状・最新化の検証結果・運用手順・未マージ作業の扱いをまとめています。

---

## 1. プロジェクト概要

| 項目 | 内容 |
| --- | --- |
| サイト | LinkOne(リンクワン)— Specialty Coffee Importers Alliance 公式LP |
| 本番URL | https://link-one.co.jp/ (WordPress + 本リポジトリのテーマ `linkone-theme` で運用) |
| リポジトリ | https://github.com/Itoh-M/Link-One |
| 会員構成(現行) | 6社 — ブラジル / パナマ / 台湾 / コスタリカ / インドネシア / コロンビア(コロンビアは Coming Soon 表記) |
| セクション構成 | `#hero` → `#concept` → `#mvv` → `#origins`(世界地図) → `#activities` → `#events`(SCAJ2026 共同出展) → `#sample`(サンプル依頼) → footer |

## 2. 最新化の検証結果(2026-07-11 実施)

| 検証項目 | 結果 |
| --- | --- |
| ローカル/リモートの同期 | ✅ `origin/main` 最新 `a1f4aa3` と一致 |
| ルートアセット ⇄ テーマアセット | ✅ `styles.css` / `script.js` / `favicon.svg` / `js/` すべて `wordpress/linkone-theme/assets/` と完全一致 |
| `index.html`(静的版) ⇄ `index.php`(テーマ版) | ✅ 本文テキスト完全一致。差分は **WP管理者専用の地図編集UI** のみで、これは設計どおり(静的版にはDOMごと存在しない) |
| 配布zip(GitHub Releases `latest`) | ✅ `5ff74dc` ビルド。それ以降のコミット(`99b05ec` / `bae7599` / `a1f4aa3`)は CI・スキル追加のみでテーマ内容に影響なし → **配布zipは実質最新** |
| GitHub Actions | ✅ `Build & Release WordPress theme` 全成功 / `Weekly Security Check` 週次で成功継続中(直近 2026-07-06) |

### 本番サイトとの照合について(要・手動確認)

この検証を行った実行環境からは `link-one.co.jp` への外部アクセスが遮断されており(ネットワークポリシーおよびサイト側403)、**本番HTMLとの直接diffは未実施**です。引き継ぎ後、以下を一度確認してください。

1. ブラウザで https://link-one.co.jp/ を開き、ソース表示(view-source)を確認
2. 会員数「6社」・コロンビア(Coming Soon)・SCAJ2026 の記載がリポジトリと一致するか確認
3. WordPress 管理画面 → 外観 → テーマ で `LinkOne` テーマのバージョンが Releases の最新zipと一致するか確認
4. ずれている場合は「4. デプロイフロー」の手順で最新zipを再アップロード

## 3. アーキテクチャ

本リポジトリは **1つのLPを2形態で保持** しています。内容を変更する際は両方の同期が必要です。

| 形態 | 実体 | 用途 |
| --- | --- | --- |
| 静的版 | ルートの `index.html` + `styles.css` + `script.js` + `js/` | GitHub Pages / Vercel 等でのプレビュー。編集UIは含まない |
| WordPressテーマ版 | `wordpress/linkone-theme/`(`index.php` / `functions.php` / `assets/`) | **本番 link-one.co.jp で使用** |

- `styles.css` / `script.js` / `favicon.svg` / `js/` は **ルートが原本**。`wordpress/build-theme.sh` がテーマ `assets/` へ同期してzip化します。
- マークアップは `index.html` と `index.php` を **手動で二重管理** しています。文言修正時は両方を編集してください(テーマ版のみ `current_user_can('edit_theme_options')` で編集UIを出力)。
- サンプル依頼フォームは **mailto: 方式**(`script.js`)。宛先は `js/sample-config.js` で管理し、`?admin=1` の管理パネルからブラウザ単位(localStorage)で上書き可能。

## 4. デプロイフロー

1. `main` に push(対象: `styles.css` / `script.js` / `favicon.svg` / `manifest.json` / `robots.txt` / `js/**` / `wordpress/**`)
2. GitHub Actions `build-theme.yml` が自動ビルドし、Releases の `latest` タグに `linkone-theme.zip` を公開
   - 🔗 https://github.com/Itoh-M/Link-One/releases/latest
3. WordPress 管理画面 → 外観 → テーマ → 新規追加 → テーマのアップロード → zip選択 → インストール → 有効化

⚠️ 注意: `index.html` の変更は上記 paths に含まれず **リリースビルドをトリガーしません**(テーマは `index.php` を使うため通常は問題なし)。`index.php` は `wordpress/**` 配下なのでトリガーされます。

## 5. 日常運用の手順

| やりたいこと | 手順 |
| --- | --- |
| 文言・セクション修正 | `index.html` と `wordpress/linkone-theme/index.php` の両方を編集 → push → zip再アップロード |
| 世界地図のドット編集 | WP管理者で `https://link-one.co.jp/?edit=1` → 編集 → **JSONエクスポート** → `script.js` の `DEFAULTS` 配列を置換 → push(詳細は README「編集モード」) |
| サンプル依頼の宛先変更 | `js/sample-config.js` を編集 → push(一時的な変更は本番で `?admin=1`) |
| ブランドカラー変更 | `styles.css` の `:root` 内 `--c-red` / `--c-yellow` / `--c-teal` / `--c-green` |
| イベントスライド追加 | `<article class="slide">` ブロックを複製・編集(両ファイル) |

## 6. 未マージPRの状況と推奨処置

| PR | 内容 | 状態 | 推奨 |
| --- | --- | --- | --- |
| [#7](https://github.com/Itoh-M/Link-One/pull/7) | 地図編集UIのWP管理者ゲート + iPhone表示修正 | ドラフト | **クローズ推奨** — 同等の修正が #9 でマージ済み(main に `current_user_can` ゲートあり) |
| [#13](https://github.com/Itoh-M/Link-One/pull/13) | サンプル依頼を REST API + `wp_mail` 送信へ置換 | ドラフト・古いmain基準 | 採否判断が必要 — 現行mainは mailto 方式のまま。メール送信を本実装するなら本PRをベースに **最新mainへリベースして再構築** |
| [#14](https://github.com/Itoh-M/Link-One/pull/14) | LP再設計計画ドキュメント(`LINKONE_REDESIGN_PLAN.md`) | ドラフト | 参考資料 — 計画の多くは `2ac5c17` のリビルドで実施済みの可能性。内容を確認のうえクローズか更新 |

## 7. 既知の制約・残タスク

- **サンプル依頼/ログインはデモ実装** — 認証情報を localStorage に平文保存。本番の会員機能化にはサーバー側実装が必須(README「認証 / サンプル依頼デモについて」参照)
- **メール送信は mailto: 依存** — 送信者のメーラーが開く方式。確実な送達が必要なら PR #13 の REST API 方式を検討
- **マークアップの二重管理** — `index.html` / `index.php` の乖離が起きやすい。本書 2章の diff 検証を変更のたびに実施推奨
- **本番との照合** — 2章記載のとおり、本番HTMLとの直接照合は引継ぎ後に一度実施のこと
- **週次セキュリティチェック** — `weekly-security-check.yml` が毎週月曜 09:00 JST に稼働中(スキル自己診断 + 簡易シークレットスキャン)。失敗時は Actions タブを確認

## 8. 関連ドキュメント

- [README.md](README.md) — ファイル構成 / ローカル確認 / 編集モード詳細 / テーマビルド・インストール手順
- [Releases](https://github.com/Itoh-M/Link-One/releases/latest) — 最新テーマzip
- `.claude/skills/system-security-rollback/` — 運用環境のセキュリティ設定ロールバック手順
