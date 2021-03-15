const { context, GitHub } = require('@actions/github');
const core = require('@actions/core');

async function run() {
  try {
    const githubToken = core.getInput('GITHUB_TOKEN');
    const octokit = new GitHub(githubToken);
    let body;
    if (context.eventName === 'pull_request') {
      if (context.payload.pull_request === null) {
        core.setFailed('No pull request found.');
        return;
      }
      body = context.payload.pull_request.body;
      console.log(payload);
    } else {
      body = context.payload.comment.body;
    }
    const hasTasks = /-\s\[\s\]/g.test(body);
    const state = hasTasks ? 'pending' : 'success';
    let { sha } = context.payload.pull_request.head;
    if (context.eventName === 'issue_comment') {
      const { data: pullRequest } = await octokit.pulls.get({
        ...context.repo,
        pull_number: context.payload.issue.number,
      });
      sha = pullRequest.head.sha;
    }
    const checkStatus = octokit.repos.createStatus({
      ...context.repo,
      sha,
      state,
      description: state === 'pending' ? 'Tasks are pending' : 'All tasks are done',
      context: 'tasks',
    });
    core.setOutput('state', state);
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
