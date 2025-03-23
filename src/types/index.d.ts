export type MessageSender = 'user' | 'ai';

export interface Message {
  id: number;
  content: string;
  sender: MessageSender;
}