export type MessageSender = 'user' | 'ai';

export interface Message {
  id: number;
  content: string;
  sender: MessageSender;
}

export interface ExpandingCardProps {
  title: string
  description: string
  image: string | StaticImageData
  link: string
}

export interface Choice {
  description: string;
  options: string[];
  selected?: string;
}