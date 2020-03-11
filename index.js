const github = require('@actions/github');
const core = require('@actions/core');

async function run() {
  try {
    const githubToken = core.getInput('GITHUB_TOKEN');


    const octokit = new github.GitHub(githubToken);
    const { context } = github;

    if (context.payload.pull_request == null) {
      core.setFailed('No pull request found.');
      return;
    }
    const body = context.eventName === ('issue_comment' || 'pull_request_review_comment') ? context.payload.comment.body : context.payload.pull_request.body;
    const pullRequestNumber = context.payload.pull_request.number;
    const isUnChecked = /-\s\[\s\]/g.test(body);
    const status = isUnChecked ? 'pending' : 'success';

    const checkStatus = octokit.repos.createStatus({
      ...context.repo,
      sha: context.payload.pull_request.head.sha,
      state: status,
      description: status === 'pending' ? 'Pending tasks' : 'Done tasks',
      context: 'tasks',
    });

    const issueComments = octokit.issues.listComments({
      ...context.repo,
      owner: context.owner,
      issue_number: pullRequestNumber,
    });
    core.setOutput('issueComments', issueComments);


    console.log(context);
    console.log(context.payload);
    console.log('muhahaha');
    console.log(context.payload.pull_request);
    console.log('muhahaha');
    console.log(context.payload.pull_request.comments);
    console.log('muhahaha');
    console.log(context.payload.comment);
    console.log('muhahaha');
    console.log(checkStatus);
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
