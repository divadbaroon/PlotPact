 import { ChatSession } from '@google/generative-ai';

 const clientsContext = new Map<string, ChatSession>();

 export function setSession(id: string, session: ChatSession) {
   clientsContext.set(id, session);
 }

 export function getSession(id: string): ChatSession | undefined {
   return clientsContext.get(id);
 }