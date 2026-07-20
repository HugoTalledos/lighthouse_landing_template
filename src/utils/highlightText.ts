export interface TextPart {
  text: string;
  highlighted: boolean;
}

export function splitHighlight(text: string, highlight?: string | null): TextPart[] {
  const idx = highlight ? text.indexOf(highlight) : -1;
  if (idx === -1) return [{ text, highlighted: false }];
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + highlight!.length);
  const after = text.slice(idx + highlight!.length);
  return [
    ...(before ? [{ text: before, highlighted: false }] : []),
    { text: match, highlighted: true },
    ...(after ? [{ text: after, highlighted: false }] : []),
  ];
}
