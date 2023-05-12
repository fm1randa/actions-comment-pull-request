import * as github from '@actions/github';
import * as core from '@actions/core';

async function run() {
  try {
    const github_token = core.getInput('github_token');
    const context = github.context;
    const pull_number = context.payload.pull_request?.number;
    const { owner, repo } = context.repo;

    const octokit = github.getOctokit(github_token);

    if (!pull_number) {
      core.setFailed('No pull request in current context.');
      return;
    }

    const body = 'BUMP!';

    await octokit.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews', {
      owner,
      repo,
      pull_number,
      body,
      event: 'COMMENT',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
