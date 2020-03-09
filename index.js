const github = require('@actions/github');
const core = require('@actions/core');
const webhooks = require('@octokit/webhooks');

async function run() {

const myToken = core.getInput('myToken');

const octokit = new github.GitHub(myToken);
const context = github.context;

const newIssue = await octokit.issues.create({
  ...context.repo,
  title: 'New issue!',
  body: 'Hello Universe!'
});

console.log(context);
console.log(newIssue);

}
run();
