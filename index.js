const github = require('@actions/github');
const core = require('@actions/core');

async function run() {
  try {
    const githubToken = core.getInput('GITHUB_TOKEN');
    const octokit = new github.GitHub(githubToken);
    const { context } = github;
    let body;
    if (context.eventName === 'pull_request') {
      if (context.payload.pull_request === null) {
        core.setFailed('No pull request found.');
        return;
      }
      body = context.payload.pull_request.body;
    } else {
      body = context.payload.comment.body;
    }
    const hasTasks = /-\s\[\s\]/g.test(body);
    const status = hasTasks ? 'pending' : 'success';
    let sha;
    if (context.eventName === 'issue_comment') {
      const { data: pullRequest } = await octokit.pulls.get({
        ...context.repo,
        pull_number: context.payload.issue.number,
      });
      sha = pullRequest.head.sha;
    }
    sha = context.eventName !== 'issue_comment' ? context.payload.pull_request.head.sha : sha;
    const checkStatus = octokit.repos.createStatus({
      ...context.repo,
      sha,
      state: status,
      description: status === 'pending' ? 'Tasks are pending' : 'All tasks are done',
      context: 'tasks',
    });
    core.setOutput("status", status);
    console.log(checkStatus);
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
