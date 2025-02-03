const fs = require('fs');
const { execSync } = require("child_process");

// Function to generate a random past date within the last year
function getRandomPastDate() {
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - Math.floor(Math.random() * 365)); 
    return pastDate.toISOString().slice(0, 19).replace("T", " "); // Format: YYYY-MM-DD HH:mm:ss
}

// Function to modify a file to make a non-empty commit
function modifyFileForCommit() {
    const fileName = 'commit_log.txt'; // File to be modified for commit
    const content = `Commit at ${new Date().toISOString()}\n`; // Content to add
    fs.appendFileSync(fileName, content, 'utf8'); // Append content to the file
    return fileName;
}

// Number of commits (250+)
const NUM_COMMITS = 250;

for (let i = 0; i < NUM_COMMITS; i++) {
    const commitDate = getRandomPastDate();
    console.log(`Creating commit for date: ${commitDate}`);

    try {
        // Modify the file before making the commit
        const fileName = modifyFileForCommit();

        // Command to create a non-empty commit
        const command = `set GIT_COMMITTER_DATE="${commitDate}" && set GIT_AUTHOR_DATE="${commitDate}" && git add ${fileName} && git commit --no-verify -m "Commit on ${commitDate}" --date "${commitDate}"`;
        console.log(`Running command: ${command}`);
        execSync(command, { stdio: "inherit", shell: true });
    } catch (error) {
        console.error(`Error creating commit on ${commitDate}:`, error);
    }
}

// Push commits to GitHub
console.log("Pushing commits to GitHub...");
try {
    execSync("git push origin main --force", { stdio: "inherit" });
} catch (error) {
    console.error("Error pushing commits to GitHub:", error);
}

console.log("✅ All commits pushed successfully! Check your GitHub contribution graph.");
