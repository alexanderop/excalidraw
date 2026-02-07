const fs = require("node:fs");
const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);

const excalidrawDir = `${__dirname}/../packages/excalidraw`;
const excalidrawPackage = `${excalidrawDir}/package.json`;
const pkg = require(excalidrawPackage);
const lastVersion = pkg.version;
const existingChangeLog = fs.readFileSync(
  `${excalidrawDir}/CHANGELOG.md`,
  "utf8",
);

const supportedTypes = ["feat", "fix", "style", "refactor", "perf", "build"];
const headerForType = {
  feat: "Features",
  fix: "Fixes",
  style: "Styles",
  refactor: " Refactor",
  perf: "Performance",
  build: "Build",
};

const badCommits = [];
const getCommitHashForLastVersion = async () => {
  try {
    const commitMessage = `"release @excalidraw/excalidraw"`;
    const { stdout } = await exec(
      `git log --format=format:"%H" --grep=${commitMessage}`,
    );
    // take commit hash from latest release
    return stdout.split(/\r?\n/)[0];
  } catch (error) {
    console.error(error);
  }
};

const getLibraryCommitsSinceLastRelease = async () => {
  const commitHash = await getCommitHashForLastVersion();
  const { stdout } = await exec(
    `git log --pretty=format:%s ${commitHash}...master`,
  );
  const commitsSinceLastRelease = stdout.split("\n");
  const commitList = {};
  for (const type of supportedTypes) {
    commitList[type] = [];
  }

  for (const commit of commitsSinceLastRelease) {
    const indexOfColon = commit.indexOf(":");
    const type = commit.slice(0, indexOfColon);
    if (!supportedTypes.includes(type)) {
      continue;
    }
    const messageWithoutType = commit.slice(indexOfColon + 1).trim();
    const messageWithCapitalizeFirst =
      messageWithoutType.charAt(0).toUpperCase() + messageWithoutType.slice(1);
    const prMatch = commit.match(/\(#(\d*)\)/);
    if (prMatch) {
      const prNumber = prMatch[1];

      // return if the changelog already contains the pr number which would happen for package updates
      if (existingChangeLog.includes(prNumber)) {
        continue;
      }
      const prMarkdown = `[#${prNumber}](https://github.com/excalidraw/excalidraw/pull/${prNumber})`;
      const messageWithPRLink = messageWithCapitalizeFirst.replace(
        /\(#\d*\)/,
        prMarkdown,
      );
      commitList[type].push(messageWithPRLink);
    } else {
      badCommits.push(commit);
      commitList[type].push(messageWithCapitalizeFirst);
    }
  }
  console.info("Bad commits:", badCommits);
  return commitList;
};

const updateChangelog = async (nextVersion) => {
  const commitList = await getLibraryCommitsSinceLastRelease();
  let changelogForLibrary =
    "## Excalidraw Library\n\n**_This section lists the updates made to the excalidraw library and will not affect the integration._**\n\n";
  for (const type of supportedTypes) {
    if (commitList[type].length > 0) {
      changelogForLibrary += `### ${headerForType[type]}\n\n`;
      const commits = commitList[type];
      for (const commit of commits) {
        changelogForLibrary += `- ${commit}\n\n`;
      }
    }
  }
  changelogForLibrary += "---\n";
  const lastVersionIndex = existingChangeLog.indexOf(`## ${lastVersion}`);
  let updatedContent =
    existingChangeLog.slice(0, lastVersionIndex) +
    changelogForLibrary +
    existingChangeLog.slice(lastVersionIndex);
  const currentDate = new Date().toISOString().slice(0, 10);
  const newVersion = `## ${nextVersion} (${currentDate})`;
  updatedContent = updatedContent.replace(`## Unreleased`, newVersion);
  fs.writeFileSync(`${excalidrawDir}/CHANGELOG.md`, updatedContent, "utf8");
};

module.exports = updateChangelog;
