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

export type StoryResponse = {
  chatId: string;
  para?: string;
  question?: string;
  choices?: string[];
  eos?: string | boolean;  
  constraints?: {
    type: string;
    description: string;
    reason: string;
  }[];
};

export type Constraint = {
  type: string;
  description: string;
  reason: string;
};

export type InteractionMode = 'idle' | 'multipleChoice' | 'freeform';

export type StoryContext = {
  story: string[];
  lastChoices: string[];
  lastQuestion?: string;
  correctAnswers?: number;
  originalPrompt?: string;
};
