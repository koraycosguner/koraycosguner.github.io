#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd -- "$(dirname -- "$0")/.." && pwd)"
default_source_root="$(cd -- "$repo_root/.." && pwd)"
push_changes=true

if [[ "${1:-}" == "--no-push" ]]; then
  push_changes=false
  shift
fi

commit_message="${1:-Update M303 lecture materials}"
source_root="${2:-$default_source_root}"

"$repo_root/scripts/publish-m303.sh" "$source_root"
"$repo_root/scripts/check-m303-site.sh"

git -C "$repo_root" add m303 teaching.html sitemap.xml scripts

if git -C "$repo_root" diff --cached --quiet; then
  echo "No M303 website changes to commit."
else
  git -C "$repo_root" commit -m "$commit_message"
fi

if [[ "$push_changes" == true ]]; then
  git -C "$repo_root" push -u origin HEAD
else
  echo "Push skipped (--no-push)."
fi
