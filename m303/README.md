# M303 Marketing Research lecture site

This directory contains the public landing page and the rendered Fall 2026 lecture presentations.

- index.html is the course landing page.
- lectures/lecture-NN/student.html is the student version.
- lectures/lecture-NN/instructor.html is the instructor version.

The source Quarto packages are maintained outside this website repository. After rebuilding them, run:

    ./scripts/publish-m303.sh "/absolute/path/to/the/Codex/workspace/outputs"

Then review the changes, commit, and push the agent/m303-course-site branch.

Before committing, validate the package with:

    ./scripts/check-m303-site.sh

For routine updates, the all-in-one command republishes the decks, validates all
40 links/files, commits any changes, and pushes the current branch:

    ./scripts/update-m303-site.sh "Update M303 lectures"

Use `--no-push` to prepare and commit an update without contacting GitHub:

    ./scripts/update-m303-site.sh --no-push "Update M303 lectures"
