export type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const chatSessions = new Map<string, Message[]>();

export function createSession(id: string, systemPrompt?: string) {
  const initial: Message[] = systemPrompt
    ? [{ role: 'system', content: systemPrompt }]
    : [];
  chatSessions.set(id, initial);
}

export function getSession(id: string): Message[] | undefined {
  return chatSessions.get(id);
}

export function updateSession(id: string, messages: Message[]) {
  chatSessions.set(id, messages);
}
