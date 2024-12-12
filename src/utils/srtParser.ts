// src/utils/srtParser.ts
import { SrtEntry } from '../types';

export const parseSrt = (content: string): SrtEntry[] => {
  const blocks = content.trim().split('\n\n');
  return blocks.map(block => {
    const [id, timeCode, ...textLines] = block.split('\n');
    const [startTime, endTime] = timeCode.split(' --> ');
    return {
      id: parseInt(id),
      startTime,
      endTime,
      text: textLines.join('\n')
    };
  });
};

export const formatSrt = (entries: SrtEntry[]): string => {
  return entries
    .map(entry => `${entry.id}\n${entry.startTime} --> ${entry.endTime}\n${entry.text}\n`)
    .join('\n');
};