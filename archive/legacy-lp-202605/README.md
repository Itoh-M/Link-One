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

## 編集モード(WordPress 管理者専用)

公開LP(静的 `index.html` / GitHub Pages)には編集UIが**含まれていません**。
編集機能は **WordPress テーマ版でのみ**、`current_user_can( 'edit_theme_options' )` を満たすユーザー(管理者・編集者など)に対してのみサーバ側で出力されます。

### 使い方(WP管理者として)

1. `wp-admin` にログイン(編集権限のあるアカウント)
2. 公開ページを開き、URL に `?edit=1` を付けてリロード
   - 例: `https://link-one.co.jp/?edit=1`
3. マップ上部に編集ツールバーが表示される

### 多層防御

| レイヤ | 効果 |
|---|---|
| サーバ側(`index.php`) | 非管理者にはツールバー/編集フォームの HTML を**一切出力しない** |
| JS 側(`script.js`) | ツールバー要素が DOM に存在しなければ `?edit=1` を付けても編集モードにならない |
| CSS 側(`styles.css`) | 仮にツールバー HTML が DOM にあっても `display: none` 既定 + `[hidden] !important` |

→ 一般訪問者は何をしても編集UIに到達できません。

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

編集内容は **localStorage** に自動保存されます(編集モード時のみ — 一般閲覧時は読み書きされず常に DEFAULTS が表示されます)。

### 編集内容を恒久的に反映する手順

`localStorage` の内容は別ブラウザや他人のPCには反映されません。確定した内容をリポジトリへ取り込むには:

1. WP 管理者として `?edit=1` でドットを編集
2. **JSONエクスポート** をクリック → `linkone-origins.json` がダウンロード
3. `script.js` の `DEFAULTS` 配列(コメント `// ---------- Origins World Map` 内)を、ダウンロードしたJSONの内容で置き換え
4. コミット・push

## WordPress テーマとしてアップロード

LP は `wordpress/linkone-theme/` 配下に **WordPress テーマ** として梱包しています。
WordPress サイトに直接アップロードしてアクティベートすれば、本LPがそのまま表示されます。

### ビルド手順

主な選択肢は2つあります。

#### A. GitHub Releases から直接ダウンロード(推奨・コマンド不要)

`main` への push があるたびに GitHub Actions が自動でビルドし、最新の zip を Releases ページに公開します。

🔗 **[最新の linkone-theme.zip をダウンロード](https://github.com/Itoh-M/Link-One/releases/latest)**

ページ下部の **Assets** から `linkone-theme.zip` を選択するだけです。

#### B. ローカルでビルド

ご自身で zip を生成したい場合:

```bash
./wordpress/build-theme.sh
# → wordpress/linkone-theme.zip が生成されます
```

このスクリプトはルートの `styles.css` / `script.js` / `favicon.svg` をテーマ内 `assets/` に同期したうえで、
zip化までを自動で行います(`zip` コマンドが必要)。

### インストール

1. WordPress 管理画面 → **外観 (Appearance)** → **テーマ (Themes)** → **新規追加 (Add New Theme)** → **テーマのアップロード (Upload Theme)**
2. `wordpress/linkone-theme.zip` を選択して **今すぐインストール (Install Now)**
3. インストール後、**有効化 (Activate)** をクリック
4. 設定 → 表示設定で **ホームページの表示** が「最新の投稿」のままで問題ありません(本テーマは固定の `index.php` で全コンテンツを描画します)

### テーマ構成

| ファイル | 役割 |
| --- | --- |
| `style.css` | テーマメタデータ(WordPress 必須ヘッダ) |
| `index.php` | LP 全体を描画する単一テンプレート |
| `functions.php` | アセット enqueue / OGP・favicon 出力 / `add_theme_support` |
| `assets/styles.css` | LP 本体スタイル(ルート `styles.css` のコピー) |
| `assets/script.js` | LP 本体スクリプト(ルート `script.js` のコピー) |
| `assets/favicon.svg` | favicon |

### 動作要件

- WordPress 6.0 以上(テストは 6.9)
- PHP 7.4 以上
- 外部CDN: Google Fonts(Noto Sans JP / Playfair Display)— ネット接続が必要

### 編集モードについて

本テーマでは編集ツールバー/フォームの HTML を `current_user_can( 'edit_theme_options' )` でラップしているため、
**管理者(または編集者)としてログインしている WP ユーザーにのみ**マップ編集UIが表示されます。

ログイン後、URL に `?edit=1` を付けて開くと編集モードに入れます:

```
https://your-site.example/?edit=1
```

非管理者(未ログイン含む)は何度 `?edit=1` を付けても編集モードに入れません(HTML レベルでツールバー要素が存在しないため)。詳細は上の「[編集モード(WordPress 管理者専用)](#編集モードwordpress-管理者専用)」を参照。

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
