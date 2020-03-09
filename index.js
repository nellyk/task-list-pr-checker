const github = require('@actions/github');
const core = require('@actions/core');
const webhooks = require('@octokit/webhooks');

const myToken = core.getInput('myToken');

const octokit = new github.GitHub(myToken);
const context = github.context;

const github = require('@actions/github');

console.log(context);
