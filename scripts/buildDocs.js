const { exec } = require("node:child_process");

// get files changed between prev and head commit
exec(`git diff --name-only HEAD^ HEAD`, async (error, stdout, stderr) => {
  if (error || stderr) {
    console.error(error);
    process.exit(1);
  }
  const changedFiles = stdout.trim().split("\n");

  const docFiles = changedFiles.filter((file) => {
    return file.includes("docs");
  });

  if (docFiles.length === 0) {
    console.info("Skipping building docs as no valid diff found");
    process.exit(0);
  }
  // Exit code 1 to build the docs in ignoredBuildStep
  process.exit(1);
});
