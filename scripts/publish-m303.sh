#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 /absolute/path/to/outputs" >&2
  exit 2
fi

source_root="$1"
repo_root="$(cd -- "$(dirname -- "$0")/.." && pwd)"
lecture_root="$repo_root/m303/lectures"

if [[ ! -d "$source_root/M303 Lecture 01 - Quarto" ]]; then
  echo "No M303 lecture packages found under: $source_root" >&2
  exit 1
fi

for lecture in $(seq -w 1 20); do
  package="$source_root/M303 Lecture $lecture - Quarto"
  instructor="$(find "$package" -maxdepth 1 -type f -name "lecture-*.html" ! -name "*-student.html" | head -1)"
  student="$(find "$package" -maxdepth 1 -type f -name "lecture-*-student.html" | head -1)"
  destination="$lecture_root/lecture-$lecture"

  if [[ -z "$instructor" || -z "$student" ]]; then
    echo "Missing instructor or student HTML for lecture $lecture" >&2
    exit 1
  fi

  mkdir -p "$destination"
  cp "$instructor" "$destination/instructor.html"
  cp "$student" "$destination/student.html"

  # Quarto's generated support scripts contain harmless line-end spaces.
  # Normalize them so repeated publishes produce clean Git diffs.
  perl -pi -e 's/[ \t]+$//' "$destination/instructor.html" "$destination/student.html"
done

echo "Published 20 instructor and 20 student decks to $lecture_root"
