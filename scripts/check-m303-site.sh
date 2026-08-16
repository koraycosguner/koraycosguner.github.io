#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd -- "$(dirname -- "$0")/.." && pwd)"
lecture_root="$repo_root/m303/lectures"
missing=0

for lecture in $(seq -w 1 20); do
  for version in student instructor; do
    file="$lecture_root/lecture-$lecture/$version.html"
    if [[ ! -s "$file" ]]; then
      echo "Missing or empty: $file" >&2
      missing=$((missing + 1))
    fi
  done
done

if [[ $missing -ne 0 ]]; then
  exit 1
fi

python3 - "$repo_root/m303/index.html" "$lecture_root" <<'PY'
from html.parser import HTMLParser
from pathlib import Path
import sys

index_path = Path(sys.argv[1])
lecture_root = Path(sys.argv[2])

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag != "a":
            return
        href = dict(attrs).get("href")
        if href:
            self.links.append(href)

parser = LinkParser()
parser.feed(index_path.read_text(encoding="utf-8"))
lecture_links = [link for link in parser.links if link.startswith("lectures/lecture-")]

if len(lecture_links) != 40:
    raise SystemExit(f"Expected 40 lecture links; found {len(lecture_links)}")

missing = [link for link in lecture_links if not (index_path.parent / link).is_file()]
if missing:
    raise SystemExit("Broken landing-page links:\n" + "\n".join(missing))

for path in lecture_root.glob("lecture-*/*.html"):
    text = path.read_text(encoding="utf-8", errors="ignore")
    required = ("Reveal.initialize", "slide-number", "Dr. Cosguner", "M303")
    absent = [token for token in required if token not in text]
    if absent:
        raise SystemExit(f"{path}: missing {', '.join(absent)}")

print("M303 site check passed: 40 lecture links and 40 presentation files.")
PY
