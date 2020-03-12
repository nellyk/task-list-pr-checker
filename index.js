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
        } else {
          body = context.payload.pull_request.body;
        }
        console.log(issueComment);
      }
    } else {
      // check if undefined then get the spefic comment
      // pull request number afterwards pass this down tho the method
      const { data: listComments } = await octokit.pulls.listComments({
        ...context.repo,
        pull_number: context.payload.issue.number,
      });

      for (let index = 0; index < listComments.length; index += 1) {
        const comment = listComments[index];
        body = comment.body;
      }
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
