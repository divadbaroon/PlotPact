export function parseGeminiJson(raw: string) {
  const cleaned = raw
    .trim()
    .replace(/^"+|"+$/g, '')
    .replace(/^```json\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  return JSON.parse(cleaned);
}