const github = require('@actions/github');
const core = require('@actions/core');

async function run() {
  try {
    const githubToken = core.getInput('GITHUB_TOKEN');
    const octokit = new github.GitHub(githubToken);
    const { context } = github;
    let body;
    let issueComment;
    if (context.eventName === 'pull_request') {
      const pullRequestNumber = context.payload.pull_request.number;
      if (context.payload.pull_request === null) {
        core.setFailed('No pull request found.');
        return;
      }
      const { data: issueComments } = await octokit.issues.listComments({
        ...context.repo,
        issue_number: pullRequestNumber,
      });
      console.log(issueComments);
      for (let index = 0; index < issueComments.length; index += 1) {
        issueComment = issueComments[index];
        if (issueComment.body !== null) {
          body = issueComment.body;
        } else {
          body = context.payload.pull_request.body;
        }
      }
    } else {
      body = context.payload.comment.body;
    }
    const isUnChecked = /-\s\[\s\]/g.test(body);
    const status = isUnChecked ? 'pending' : 'success';
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
      description: status === 'pending' ? 'Pending tasks' : 'Done tasks',
      context: 'tasks',
    });
    console.log(checkStatus);
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
