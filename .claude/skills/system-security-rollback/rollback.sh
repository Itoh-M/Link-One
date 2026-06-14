#!/usr/bin/env bash
#
# system-security-rollback — セキュリティ強化変更のロールバック/検証ツール
#
# 使い方:
#   sudo ./rollback.sh status                 # 現在の適用状態を確認
#   sudo ./rollback.sh rollback <id>          # 特定の変更を元に戻す
#   sudo ./rollback.sh rollback all           # 全ての変更を元に戻す
#   sudo ./rollback.sh verify                 # 設定が壊れていないか健全性チェック
#
#   <id>: sudoers_nopasswd | ufw_firewall | sysctl_hardening |
#         login_defs | home_perms | ppa_removal | apparmor
#
# 注: apt_upgrade は安全にロールバックできないため対象外。
#
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="$SCRIPT_DIR/backups"

c_red()   { printf '\033[31m%s\033[0m\n' "$*"; }
c_grn()   { printf '\033[32m%s\033[0m\n' "$*"; }
c_ylw()   { printf '\033[33m%s\033[0m\n' "$*"; }
require_root() { [ "$(id -u)" -eq 0 ] || { c_red "root権限が必要です (sudo で実行してください)"; exit 1; }; }

# ---------------------------------------------------------------- ロールバック関数

rb_sudoers_nopasswd() {
  if grep -q '^claude ALL=(ALL) NOPASSWD: ALL' /etc/sudoers; then
    c_ylw "既にNOPASSWD設定が存在します。スキップ。"
    return 0
  fi
  cp /etc/sudoers /etc/sudoers.rollback.bak
  echo 'claude ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers
  # 構文検証 — 壊れていたら復元
  if visudo -c -f /etc/sudoers >/dev/null 2>&1; then
    c_grn "✅ NOPASSWD sudo設定を復元しました"
  else
    cp /etc/sudoers.rollback.bak /etc/sudoers
    c_red "❌ 構文エラーのため復元を取り消しました"
    return 1
  fi
}

rb_ufw_firewall() {
  command -v ufw >/dev/null 2>&1 && ufw disable >/dev/null 2>&1
  c_grn "✅ UFWファイアウォールを無効化しました"
}

rb_sysctl_hardening() {
  rm -f /etc/sysctl.d/99-hardening.conf
  # 元の(緩い)値に戻す
  sysctl -w kernel.dmesg_restrict=0 >/dev/null 2>&1
  sysctl -w kernel.kptr_restrict=0 >/dev/null 2>&1
  sysctl -w net.ipv4.conf.all.rp_filter=0 >/dev/null 2>&1
  sysctl --system >/dev/null 2>&1
  c_grn "✅ Kernel Security Parametersを元に戻しました"
}

rb_login_defs() {
  sed -i 's/^PASS_MAX_DAYS.*/PASS_MAX_DAYS\t99999/' /etc/login.defs
  sed -i 's/^PASS_MIN_DAYS.*/PASS_MIN_DAYS\t0/'     /etc/login.defs
  sed -i 's/^PASS_WARN_AGE.*/PASS_WARN_AGE\t7/'     /etc/login.defs
  c_grn "✅ パスワードポリシーを元に戻しました"
}

rb_home_perms() {
  chmod 755 /home/user
  c_grn "✅ ホームディレクトリのパーミッションを755に戻しました"
}

rb_ppa_removal() {
  c_ylw "PPAは元々403エラーで使用不能でした。再追加する場合は手動で:"
  echo "  add-apt-repository ppa:deadsnakes/ppa"
  echo "  add-apt-repository ppa:ondrej/php"
}

rb_apparmor() {
  systemctl disable --now apparmor >/dev/null 2>&1
  c_grn "✅ AppArmorを無効化しました"
}

# ---------------------------------------------------------------- コマンド

cmd_selftest() {
  # CI/非root環境で実行可能。ライブシステムに触れず、スキルの整合性を検証する。
  local ok=0
  local dir="$SCRIPT_DIR"
  echo "=== セルフテスト (CI用) ==="
  # 1. スクリプト構文
  if bash -n "$dir/rollback.sh" 2>/dev/null; then c_grn "✅ rollback.sh 構文OK"; else c_red "❌ rollback.sh 構文エラー"; ok=1; fi
  # 2. マニフェストのJSON妥当性
  if command -v python3 >/dev/null 2>&1; then
    if python3 -c "import json,sys; json.load(open('$dir/changes-manifest.json'))" 2>/dev/null; then
      c_grn "✅ changes-manifest.json 妥当なJSON"
    else c_red "❌ changes-manifest.json JSONエラー"; ok=1; fi
  fi
  # 3. 必須ファイルの存在
  for f in SKILL.md rollback.sh changes-manifest.json; do
    [ -f "$dir/$f" ] && c_grn "✅ $f 存在" || { c_red "❌ $f 不在"; ok=1; }
  done
  # 4. 全ロールバックIDがcase文に存在するか
  for id in sudoers_nopasswd ufw_firewall sysctl_hardening login_defs home_perms ppa_removal apparmor; do
    grep -q "    $id)" "$dir/rollback.sh" || { c_red "❌ ロールバックID未実装: $id"; ok=1; }
  done
  [ "$ok" -eq 0 ] && c_grn "総合: セルフテスト合格" || c_red "総合: セルフテスト失敗"
  return $ok
}

cmd_status() {
  echo "=== セキュリティ強化の適用状態 ==="
  echo
  grep -q '^claude ALL=(ALL) NOPASSWD: ALL' /etc/sudoers \
    && c_ylw "sudoers_nopasswd : NOPASSWDあり (緩い)" \
    || c_grn  "sudoers_nopasswd : 削除済み (安全)"
  if command -v ufw >/dev/null 2>&1 && ufw status 2>/dev/null | grep -q 'Status: active'; then
    c_grn "ufw_firewall    : active (安全)"
  else
    c_ylw "ufw_firewall    : 無効"
  fi
  [ -f /etc/sysctl.d/99-hardening.conf ] \
    && c_grn "sysctl_hardening: 適用中 (安全)" \
    || c_ylw "sysctl_hardening: 未適用"
  grep -q '^PASS_MAX_DAYS\s*90' /etc/login.defs \
    && c_grn "login_defs      : 強化済み (90日)" \
    || c_ylw "login_defs      : デフォルト"
  [ "$(stat -c '%a' /home/user)" = "750" ] \
    && c_grn "home_perms      : 750 (安全)" \
    || c_ylw "home_perms      : $(stat -c '%a' /home/user)"
  systemctl is-active apparmor >/dev/null 2>&1 \
    && c_grn "apparmor        : active (安全)" \
    || c_ylw "apparmor        : 無効"
}

cmd_verify() {
  echo "=== 健全性チェック ==="
  local ok=0
  if visudo -c >/dev/null 2>&1; then c_grn "✅ /etc/sudoers 構文OK"; else c_red "❌ /etc/sudoers 構文エラー!"; ok=1; fi
  if id claude >/dev/null 2>&1; then c_grn "✅ claudeユーザー健在"; else c_red "❌ claudeユーザー異常"; ok=1; fi
  if [ -d /home/user ]; then c_grn "✅ ホームディレクトリ存在"; else c_red "❌ ホームディレクトリ消失!"; ok=1; fi
  # ネットワーク疎通(外向き許可されているはず)
  if timeout 5 getent hosts archive.ubuntu.com >/dev/null 2>&1; then c_grn "✅ DNS/ネットワーク疎通OK"; else c_ylw "⚠️  ネットワーク疎通を確認できません"; fi
  [ "$ok" -eq 0 ] && c_grn "総合: 問題なし" || c_red "総合: 問題あり — rollback を検討してください"
  return $ok
}

cmd_rollback() {
  local id="${1:-}"
  case "$id" in
    sudoers_nopasswd) rb_sudoers_nopasswd ;;
    ufw_firewall)     rb_ufw_firewall ;;
    sysctl_hardening) rb_sysctl_hardening ;;
    login_defs)       rb_login_defs ;;
    home_perms)       rb_home_perms ;;
    ppa_removal)      rb_ppa_removal ;;
    apparmor)         rb_apparmor ;;
    all)
      c_ylw "全ての変更をロールバックします..."
      rb_sysctl_hardening
      rb_login_defs
      rb_home_perms
      rb_ufw_firewall
      rb_apparmor
      rb_ppa_removal
      c_ylw "注: sudoers_nopasswd は危険なため自動では戻しません。"
      c_ylw "    必要なら: sudo $0 rollback sudoers_nopasswd"
      ;;
    *)
      c_red "不明なID: '$id'"
      echo "有効なID: sudoers_nopasswd ufw_firewall sysctl_hardening login_defs home_perms ppa_removal apparmor all"
      exit 1 ;;
  esac
}

main() {
  local cmd="${1:-status}"
  case "$cmd" in
    status)   cmd_status ;;
    selftest) cmd_selftest ;;
    verify)   require_root; cmd_verify ;;
    rollback) require_root; shift; cmd_rollback "${1:-}" ;;
    *) echo "使い方: sudo $0 {status|verify|selftest|rollback <id>|rollback all}"; exit 1 ;;
  esac
}

main "$@"
