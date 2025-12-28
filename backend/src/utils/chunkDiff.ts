import type { PrFile } from '../types';

const MAX_CHUNK_SIZE = 8000;

export function chunkDiff(files: PrFile[]): string {
  const chunks: string[] = [];

  for (const file of files) {
    if (!file.patch) {
      continue;
    }

    const fileHeader = `\n--- File: ${file.filename} (${file.status}) ---\n`;
    const fileDiff = `${fileHeader}${file.patch}\n`;

    chunks.push(fileDiff);
  }

  const fullDiff = chunks.join('\n');

  if (fullDiff.length > MAX_CHUNK_SIZE) {
    return fullDiff.slice(0, MAX_CHUNK_SIZE) + '\n\n... (diff truncated due to size)';
  }

  return fullDiff;
}
