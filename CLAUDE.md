# LinkOne LP プロジェクト

本番サイト: https://link-one.co.jp/ （WordPress上で公開中）
LinkOne（Green Coffee Importers Alliance）— スペシャルティコーヒー生豆インポーターズアライアンスの公式LP。

## 正データ（これ以外を編集・参照しないこと）

| ファイル | 役割 |
| --- | --- |
| `index.html` | **編集用の正。** LPの修正はこのファイルだけを変更する。現行版は6社リニューアル版（2026-07-13） |
| `brand/original.html` | 2026-07-12時点の本番公開版スナップショット（リニューアル前の旧デザイン）。**編集禁止** |

LPは単一の自己完結HTML（CSS/JSすべてインライン）。外部依存は Google Fonts、
本番WPアップロード上の世界地図画像、Instagram埋め込みのみ。
リモート実行環境ではこの3点が欠落表示になるが、本番では正常に表示される。

## 使用禁止（古いバージョン・タスク途中バージョン）

- `archive/legacy-lp-202605/` 以下すべて（旧LP・旧WordPressテーマ一式）。参照も流用もしない
- 2026-06以前の作業ブランチ（`main-backup`、`claude/linkone-world-map-redesign-JhH4r` など）
- 旧リポジトリ `Itoh-M/LinkOne`（世界地図ウィジェット単体。LPの元データではない）
- GitHub Releases「latest」の `linkone-theme.zip`（旧LP由来のため使わない・本番へアップロードしない）

## 編集ワークフロー

1. `main` から作業ブランチを切る
2. `index.html` のみを編集する（`brand/original.html` には触れない）
3. Chromium（Playwright）でレンダリングし、スクリーンショットで確認する
4. PRを作成して `main` へマージする
5. 安定版になったら日付タグを打つ: `git tag lp-YYYYMMDD && git push origin lp-YYYYMMDD`

## デザイン作業でのスキル活用（必須）

`.claude/skills/` に導入済みのUIスキル（2026-07-22, PR #24）を、**見た目に関わる
すべてのタスクで標準ワークフローとして使う**。明示的に頼まれなくても適用すること。

| 場面 | 使うスキル |
| --- | --- |
| 着手前の調査・方針決め | `ui-ux-pro-max`（配色・フォント・スタイルをローカルDB検索。スタックは html-tailwind ではなく素のHTML/CSSとして読み替える）。大きめの改修は `improve-ui` で現状監査してから |
| 実装・リデザイン | `impeccable`（craft / polish / critique / colorize / animate 等）。編集後は自動フック（`.claude/settings.json`）がデザイン検査を行うので、指摘はその場で解消してから次へ進む |
| 仕上げ | `baseline-ui`（余白・階層・タイポグラフィの最終調整）→ `fixing-accessibility`（コントラスト・ARIA・キーボード操作） |
| アニメーション変更時 | `fixing-motion-performance` |
| OGP・メタタグ・構造化データ | `fixing-metadata` |
| バナー・スライド等の販促物 | `banner-design` / `slides` / `design`（ブランド一貫性は `brand`） |
| 最終検証 | 従来どおり `lp-verify`（デスクトップ1280px／モバイル390pxのスクショ確認） |

注意: LPは単一自己完結HTML（インラインCSS/JS）。Tailwind・React前提の提案は
素のCSSに読み替えて適用する。スキルの指摘とオーナーの明示指示が矛盾する場合は
オーナー指示を優先する。

## スナップショット（ロールバック基準点）

各時点の完成版を**スナップショットブランチ**（`prod-snapshot-*`）で凍結保存している。
実行環境のgitプロキシはタグのpushを通さないため、タグではなくブランチで管理する。
`prod-snapshot-*` ブランチには**絶対にpushしない**（不変の基準点）。

| ブランチ | コミット | 内容 |
| --- | --- | --- |
| `prod-snapshot-20260713` | `ee615aa` | **現行版**。6社リニューアル（明るいトーン・日本語主体・日本中心マップ・各国個別ページ・コロンビア加盟・ロゴ拡大） |
| `prod-snapshot-20260712` | `d77cc15` | リニューアル前の旧デザイン（= `brand/original.html`） |

## ロールバック手順

- 現行版（2026-07-13）へ戻す:
  ```
  git fetch origin prod-snapshot-20260713
  git checkout origin/prod-snapshot-20260713 -- index.html
  ```
- リニューアル前（旧デザイン）へ戻す:
  ```
  cp brand/original.html index.html      # brand/original.html は旧デザインのまま
  ```
- 任意の時点へ戻す:
  ```
  git log --oneline -- index.html      # 履歴から時点を選ぶ
  git checkout <commit> -- index.html
  ```

## 本番反映（公開）

本番は WordPress（https://link-one.co.jp/ ）。`index.html` は単一の自己完結HTML
（CSS/JSインライン）なので、**固定ページの「カスタムHTML」ブロックに全文貼り付け**れば反映できる。

手順（オーナー作業）:
1. `index.html` の中身を全文コピー（GitHubの `main` から取得、または引き渡したファイルを使用）
2. WordPress管理画面 → 該当の固定ページを編集 → カスタムHTMLブロックに貼り付け → 更新
3. 世界地図画像はインラインSVG化済みのため、旧 `WORLD_MAP.png`（WPメディア）への依存はなし

※ リモート実行環境からは本番WordPressへ直接反映できない（自ホスト・到達不可）ため、
　上記の貼り付けはオーナーが手動で実施する。反映後、必要に応じて `brand/original.html`
　を現行版へ更新し、新しい `prod-snapshot-YYYYMMDD` を切ってもよい。
