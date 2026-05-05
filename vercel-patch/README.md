# Vercel patch — `Itoh-M/LinkOne` 用の修正済み `index.html`

これは Vercel デプロイ元 `Itoh-M/LinkOne` の `index.html` の **修正済み版** です。
本リポ(`Link-One`)とは別系統の成果物で、ここはあくまで配信用の置き場です。

## 何を直したか(2行のCSSのみ)

`index.html` の L28 と L29 で `.admin-toggle{...display:flex...}` と
`.admin-panel{...display:flex...}` が UA の `[hidden]{display:none}` を
上書きしていたため、編集パネル/歯車ボタンが**全訪問者に常時表示**されていた。
これを `display:none` を既定とし、`body.admin-mode` クラスが付いた時のみ
`display:flex` に切り替わるように変更。

JS は既に `?admin=1&key=linkone-2026` で `body.admin-mode` を付与しているため、
JS 改変は不要。

## 適用方法

1. https://github.com/Itoh-M/LinkOne/edit/main/index.html を開く
2. エディタで全文選択(`Ctrl+A` / `Cmd+A`)→ 削除
3. ここの `index.html` を全文コピーして貼付:
   - GitHub から直接コピーする場合: <https://raw.githubusercontent.com/Itoh-M/Link-One/claude/continue-work-qOVFO/vercel-patch/index.html>
4. **Commit changes** → Vercel が自動再デプロイ(約 30 秒)

## 検証

- 未ログインの iPhone Safari で `https://<vercel-url>/` →
  世界地図が見え、編集パネル/歯車ボタンが**消えている**こと
- 管理者は `https://<vercel-url>/?admin=1&key=linkone-2026` で
  従来どおり編集UIが表示されること
