const github = require('@actions/github');
const core = require('@actions/core');
const webhooks = require('@octokit/webhooks');

async function run() {

    try {
const github_token = core.getInput('GITHUB_TOKEN');


const octokit = new github.GitHub(github_token);
const context = github.context;

if (context.payload.pull_request == null) {
    core.setFailed('No pull request found.');
    return;
}
const pull_request_number = context.payload.pull_request.number;

const title = context.payload.pull_request.title;
const body = context.payload.pull_request.body;
const isUnChecked = /-\s\[\s\]/g.test(body);
const status = isUnChecked ? "pending" : "success";
const message = `Updating PR "${title}" (${context.payload.pull_request
    .html_url}): ${status}`;
const new_comment = octokit.issues.createComment({
    ...context.repo,
    issue_number: pull_request_number,
    body: message
  });

  const checkStatus =  octokit.repos.createStatus({
      ...context.repo,  
      sha: context.payload.pull_request.head.sha,
      state: status,
      description: status ? "you have tasks" : "this are all done",
      context: "tasks"
  });

console.log(context);
console.log(checkStatus);
    }catch(error){
    core.setFailed(error.message);
    }

}
run();
