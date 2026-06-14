---
name: system-security-rollback
description: Roll back or verify the Ubuntu system security hardening that was applied on 2026-06-14 (sudoers NOPASSWD removal, UFW firewall, kernel sysctl hardening, password policy, home permissions, PPA removal, AppArmor). Use this when the PC/environment misbehaves after the security fixes — e.g. sudo prompts break automation, rootless containers/sandboxes fail, services are unreachable, or a service won't start — and you need to inspect what changed and undo it safely (individually or all at once).
---

# System Security Rollback

2026-06-14 にこの Ubuntu 24.04 環境へ適用したセキュリティ強化を、**安全に確認・ロールバック**するためのスキルです。強化によって不具合が出た場合の復旧手段を提供します。

## いつ使うか

以下のような症状が出たら使用します:

- `sudo` がパスワードを要求して自動化・スクリプトが止まった
- rootless Docker / コンテナ / サンドボックスが起動しなくなった（`unprivileged_userns_clone=0` が原因の可能性）
- ネットワークサービスへ接続できない（UFW の incoming deny が原因の可能性）
- 何らかのサービスが起動しない（AppArmor プロファイルが原因の可能性）
- 「強化前の状態に戻したい」と言われた

## 何が変更されたか

詳細は `changes-manifest.json` を参照。8項目の変更があり、各 `before`/`after`/`rollback`/リスクが記録されています。

| ID | 変更内容 | ロールバックのリスク |
|----|---------|-----------------|
| `sudoers_nopasswd` | NOPASSWD sudo を削除 | **高** — 戻すと無パスワードroot復活 |
| `apt_upgrade` | 99パッケージ更新 | 安全に戻せない（対象外） |
| `ufw_firewall` | UFW 有効化 | 低 |
| `sysctl_hardening` | カーネルパラメータ強化 | 低 |
| `login_defs` | パスワードポリシー強化 | 低 |
| `home_perms` | /home/user を 750 に | 低 |
| `ppa_removal` | 壊れたPPA削除 | 低 |
| `apparmor` | AppArmor 有効化 | 低 |

## 手順

### 1. まず状態と健全性を確認する

```bash
sudo .claude/skills/system-security-rollback/rollback.sh status
sudo .claude/skills/system-security-rollback/rollback.sh verify
```

`verify` は sudoers の構文・ユーザーアカウント・ホームディレクトリ・ネットワーク疎通をチェックします。

### 2. 症状から原因の変更を特定する

- sudo が自動化を止めた → `sudoers_nopasswd`
- コンテナ/サンドボックスが壊れた → `sysctl_hardening`
- サービスに接続できない → `ufw_firewall`
- サービスが起動しない → `apparmor`

### 3. 該当する変更だけをロールバックする（推奨）

問題を起こしている1項目だけ戻すのが最も安全です:

```bash
sudo .claude/skills/system-security-rollback/rollback.sh rollback sysctl_hardening
```

### 4. どうしても切り分けできない場合は全戻し

```bash
sudo .claude/skills/system-security-rollback/rollback.sh rollback all
```

`all` は安全な7項目を戻します。**危険な `sudoers_nopasswd` だけは自動では戻しません**（明示的に指定した場合のみ）。

### 5. ロールバック後に再確認

```bash
sudo .claude/skills/system-security-rollback/rollback.sh status
sudo .claude/skills/system-security-rollback/rollback.sh verify
```

## 重要な注意

- **`sudoers_nopasswd` を戻すのは最終手段**。これはパスワードなしの root 権限を復活させ、セキュリティ上の最大の穴を再び開けます。自動化が完全に止まった場合のみ、影響を理解した上で実行してください。
- `apt_upgrade` は一括ロールバック非対応。特定パッケージで問題が出た場合のみ、そのパッケージを個別に `apt install <pkg>=<旧バージョン>` でダウングレードしてください（既知CVEが再導入される点に注意）。
- ロールバックスクリプトは sudoers 編集時に `visudo -c` で構文検証し、壊れたら自動で元に戻すフェイルセーフを備えています。
- バックアップは `backups/` にあります（`*.applied` = 適用後の状態）。

## 週次ルーチン (自動チェック)

確実に発火する週一回のチェックは **GitHub Actions** で実行します
（`.github/workflows/weekly-security-check.yml`）。エフェメラルな実環境では
ローカル cron が永続しないため、CI スケジュールを採用しています。

- **頻度**: 毎週月曜 00:00 UTC（= 月曜 09:00 JST）。手動実行も可（workflow_dispatch）。
- **内容**:
  - `rollback.sh selftest` — スクリプト構文 / マニフェスト JSON / 必須ファイル / 全ロールバックID実装の検証（root 不要）
  - ShellCheck による静的解析
  - 簡易シークレットスキャン（誤コミットされた鍵・認証情報の検出）
- **注意**: CI は独立したランナー上で動くため、この特定のエフェメラル環境の
  ライブ状態（sudoers・claude ユーザー等）ではなく、**スキルとリポジトリ**を検査します。
  実環境のライブ健全性を見たいときは、その環境で `rollback.sh verify` を実行してください。

`selftest` はローカルでも root なしで実行できます:

```bash
bash .claude/skills/system-security-rollback/rollback.sh selftest
```

## ファイル構成

- `SKILL.md` — このドキュメント
- `rollback.sh` — 状態確認・検証・ロールバックを行う実行スクリプト
- `changes-manifest.json` — 全変更の before/after/リスクの記録
- `backups/` — 適用後の設定ファイルのコピー
