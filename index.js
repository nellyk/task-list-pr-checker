const github = require('@actions/github');
const core = require('@actions/core');
const webhooks = require('@octokit/webhooks');

const context = github.context;

if (context.eventName === 'push') {
    const pushPayload = webhooks.WebhookPayloadPush;
    core.info(`The head commit is: ${pushPayload}`)
  }

  async function run() {
    // This should be a token with access to your repository scoped in as a secret.
    // The YML workflow will need to set myToken with the GitHub Secret Token
    // myToken: ${{ secrets.GITHUB_TOKEN }}
    // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
    const myToken = core.getInput('myToken');

    const octokit = new github.GitHub(myToken);

    const { data: pullRequest } = await octokit.pulls.get({
        owner: 'octokit',
        repo: 'rest.js',
        pull_number: 3,
        mediaType: {
          format: 'diff'
        }
    });

    console.log(pullRequest);
}

run()
