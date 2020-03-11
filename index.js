const github = require('@actions/github');
const core = require('@actions/core');

async function run() {
  try {
    const githubToken = core.getInput('GITHUB_TOKEN');


    const octokit = new github.GitHub(githubToken);
    const { context } = github;
    const pullRequestNumber = context.payload.pull_request.number;

    if (context.payload.pull_request == null) {
      core.setFailed('No pull request found.');
      return;
    }

    const { data: issueComments } = await octokit.issues.listComments({
      owner: 'nellyk',
      repo: 'task-list-pr-checker',
      issue_number: pullRequestNumber,
    });


    console.log(issueComments);
    let issueComment = '';
    const { body } = context.payload.pull_request;
    for (let index = 0; index < issueComments.length; index++) {
      issueComment = issueComments[index];
      console.log(issueComment);
    }
    const isUnChecked = /-\s\[\s\]/g.test(body);
    const status = isUnChecked ? 'pending' : 'success';
    const checkStatus = octokit.repos.createStatus({
      ...context.repo,
      sha: context.payload.pull_request.head.sha,
      state: status,
      description: status === 'pending' ? 'Pending tasks' : 'Done tasks',
      context: 'tasks',
    });
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
