#!/usr/bin/env bash
# Install YuBing Insight systemd units (API + Admin + H5).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
UNIT_DIR="/etc/systemd/system"

# Taro/Vite dev servers need many file watchers (default 8192 is too low).
if [[ "$(cat /proc/sys/fs/inotify/max_user_watches)" -lt 524288 ]]; then
  echo 'fs.inotify.max_user_watches=524288' > /etc/sysctl.d/99-yubing.conf
  sysctl -p /etc/sysctl.d/99-yubing.conf
fi

for unit in yubing-api yubing-admin yubing-h5; do
  cp "$ROOT/scripts/systemd/${unit}.service" "$UNIT_DIR/${unit}.service"
done

systemctl daemon-reload
systemctl enable yubing-api yubing-admin yubing-h5
systemctl restart yubing-api
sleep 8
systemctl restart yubing-admin yubing-h5

echo "=== status ==="
systemctl is-active yubing-api yubing-admin yubing-h5
echo "=== ports ==="
ss -tlnp | grep -E ':3000|:5173|:10086' || true
