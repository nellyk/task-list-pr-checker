const github = require('@actions/github');
const core = require('@actions/core');

async function run() {
  try {
    const githubToken = core.getInput('GITHUB_TOKEN');


    const octokit = new github.GitHub(githubToken);
    const { context } = github;
    let body;
    let issueComment;
    if (context.eventName !== 'issue_comment') {
      const pullRequestNumber = context.payload.pull_request.number;
      if (context.payload.pull_request == null) {
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
        if (context.eventName === 'pull_request_review_comment') {
          body = context.payload.comment.body;
        } else if (issueComment.body !== null) {
          body = issueComment.body;
        } else {
          body = context.payload.pull_request.body;
        }
        console.log(issueComment);
      }
    } else {
      console.log(context.payload);
      body = context.payload.comment.body;
    }
    const isUnChecked = /-\s\[\s\]/g.test(body);
    const status = isUnChecked ? 'pending' : 'success';
    let sha;
    // check if undefined then get the spefic comment
    // pull request number afterwards pass this down tho the method
    if (context.eventName !== 'issue_comment') {
      const { data: pullRequest } = await octokit.pulls.get({
        ...context.repo,
        pull_number: context.payload.issue.number,
      });
      sha = pullRequest.head.sha;
      console.log(`yebo ${sha}`);
    }
    sha = context.eventName !== 'issue_comment' ? context.payload.pull_request.head.sha : sha;
    const checkStatus = octokit.repos.createStatus({
      ...context.repo,
      sha,
      state: status,
      description: status === 'pending' ? 'Pending tasks' : 'Done tasks',
      context: 'tasks',
    });
    console.log(context);
    console.log(context.payload);
    console.log('muhahaha');
    console.log(context.payload.pull_request);
    console.log('muhahaha');
    console.log('muhahaha');
    console.log(context.payload.comment);
    console.log('muhahaha');
    console.log(checkStatus);
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
