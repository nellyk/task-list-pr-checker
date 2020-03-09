const github = require('@actions/github');
const core = require('@actions/core');
const webhooks = require('@octokit/webhooks');

const context = github.context;

if (context.eventName === 'push') {
    const pushPayload = webhooks.WebhookPayloadPush;
    core.info(`The head commit is: ${pushPayload}`)
    console.log(pushPayload);
  }
