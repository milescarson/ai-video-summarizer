interface ParsedPrUrl {
  owner: string;
  repo: string;
  pullNumber: number;
}

export function parsePrUrl(prUrl: string): ParsedPrUrl {
  const urlPattern = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)\/pull\/(\d+)$/;
  const match = prUrl.match(urlPattern);

  if (!match) {
    throw new Error('Invalid GitHub PR URL format');
  }

  const [, owner, repo, pullNumberStr] = match;

  return {
    owner,
    repo,
    pullNumber: parseInt(pullNumberStr, 10),
  };
}
