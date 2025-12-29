import type { TranscriptSegment } from '../types';

const MAX_CHUNK_SIZE = 8000;

export function chunkTranscript(segments: TranscriptSegment[]): string {
  const fullTranscript = segments.map((segment) => segment.text).join(' ');

  if (fullTranscript.length > MAX_CHUNK_SIZE) {
    return fullTranscript.slice(0, MAX_CHUNK_SIZE) + '\n\n... (transcript truncated due to size)';
  }

  return fullTranscript;
}
