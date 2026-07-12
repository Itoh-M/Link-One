# LinkOne LP プロジェクト

本番サイト: https://link-one.co.jp/ （WordPress上で公開中）
LinkOne（Green Coffee Importers Alliance）— スペシャルティコーヒー生豆インポーターズアライアンスの公式LP。

## 正データ（これ以外を編集・参照しないこと）

| ファイル | 役割 |
| --- | --- |
| `index.html` | **編集用の正。** LPの修正はこのファイルだけを変更する |
| `brand/original.html` | 2026-07-12時点の本番公開版スナップショット。**編集禁止**（ロールバック基準点） |

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

## ロールバック手順

- 本番公開版（基準点）へ戻す:
  ```
  git checkout prod-snapshot-20260712 -- index.html
  ```
- 任意の時点へ戻す:
  ```
  git log --oneline -- index.html      # 履歴から時点を選ぶ
  git checkout <commit> -- index.html
  ```
- タグ一覧: `git tag -l 'lp-*' 'prod-*'`

## 本番反映

本番はWordPress。編集内容の本番への反映方法（固定ページ貼り付け／テーマ等）は
オーナーに確認してから実施すること（2026-07-12時点で未確定）。
