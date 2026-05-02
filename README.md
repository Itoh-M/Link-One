# LinkOne LP

LinkOne(リンクワン)— Specialty Coffee Importers Alliance の公式ランディングページ。

特定の国・地域・農園のスペシャルティコーヒー生豆を専門的に輸入・販売する企業・個人によるアライアンス、LinkOne の紹介LPです。

## ファイル構成

| ファイル | 役割 |
| --- | --- |
| `index.html` | マークアップ(全セクション) |
| `styles.css` | スタイル(ブランドカラー・レスポンシブ・モーダル等) |
| `script.js` | インタラクション(スライドショー / ユーザー登録デモ / 世界地図エディタ) |
| `source/` | 元データ(PPTX) — 公開には不要 |

## ローカルでの確認

`index.html` をブラウザで直接開けば動作します。`fetch` 等は使っていないため、ローカルサーバーは不要です。
ローカルサーバーで動作確認したい場合:

```bash
python -m http.server 8000
# → http://localhost:8000
```

## セクション一覧

`#hero` → `#about` → `#origins`(世界地図) → `#members` → `#activities` → `#events`(スライドショー) → `#gallery` → `#sample`(ログイン+サンプル依頼デモ) → footer

## 編集モード(`?edit=1`)

URLの末尾に `?edit=1` を付けて開くと、Origins セクションのドットをブラウザ上で自由に編集できます。

例:
- `index.html?edit=1`
- `http://localhost:8000/?edit=1`
- 公開後 `https://example.com/?edit=1`

### できること

- **＋ドット追加** — 追加モードに切替、マップ上をクリックして任意位置にドットを生成
- **ドラッグ移動** — 既存ドットを掴んで好きな位置へ(マウス・タッチ両対応)
- **クリックで編集** — 編集パネル(右側)で以下を変更可能:
  - ラベル(マップ hover 表示)
  - タイトル(クリック時のモーダル見出し)
  - 説明本文
  - リンクURL(モーダル内「詳細を見る」ボタン)
  - 画像URL(モーダル内に表示)
  - 色 / X位置 / Y位置(`%`)
  - 最背面レイヤートグル(クリック透過 — 隣接ドットへのクリックを優先したい時に使用)
- **JSONエクスポート** — 編集内容を `linkone-origins.json` としてダウンロード
- **JSONインポート** — エクスポートしたJSONを読み込んで一括反映
- **初期化** — `script.js` の `DEFAULTS` に戻す(localStorageの編集内容は破棄)

編集内容は **localStorage** に自動保存されます(同一ブラウザ・同一オリジンでのみ保持)。

### 編集内容を恒久的に反映する手順

`localStorage` の内容は別ブラウザや他人のPCには反映されません。確定した内容をリポジトリへ取り込むには:

1. `?edit=1` でドットを編集
2. **JSONエクスポート** をクリック → `linkone-origins.json` がダウンロード
3. `script.js` の `DEFAULTS` 配列(コメント `// ---------- Origins World Map` 内)を、ダウンロードしたJSONの内容で置き換え
4. コミット・push

## カスタマイズポイント

| やりたいこと | 編集箇所 |
| --- | --- |
| メンバー企業の公式サイトURL | `index.html` 内の `data-edit-url` 付き `<a href="#">` を実URLへ差し替え |
| ギャラリー画像・動画 | `index.html` の `<figure class="gallery-item">` 内、`gallery-placeholder` を `<img>` / `<video>` / `<iframe>` に置換(`details.gallery-howto` に記法あり) |
| イベントスライドの追加 | `<article class="slide">` ブロックを複製・編集 |
| ブランドカラー | `styles.css` の `:root` 内 `--c-red` / `--c-yellow` / `--c-teal` / `--c-green` |
| サンプル豆の選択肢 | `index.html` の `.sample-grid` 内 `<label class="sample-pick">` |

## 認証 / サンプル依頼デモについて

`#sample` セクションのユーザー登録・ログイン・サンプル依頼は、すべて **localStorage に平文で保存するデモ** です。
本番運用では:

- パスワードは必ずサーバー側でハッシュ化
- サンプル依頼はメール送信 or サーバー保存 へ置換
- 入力値のバリデーションを強化

を行なってください。
