export function parseGeminiJson(raw: string): any {
  const cleaned = raw
    .trim()
    .replace(/^"+|"+$/g, '')
    .replace(/^```json\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  return JSON.parse(cleaned);
}