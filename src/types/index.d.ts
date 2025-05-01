export type InteractionMode = 'idle' | 'multipleChoice' | 'freeform';

export type ConstraintFunction = 'exclusionary' | 'focusing';
export type ConstraintType = 'channel' | 'anchor';
export type ConstraintFlexibility = 'fixed' | 'flexible';

export interface Constraint {
  id: string;
  function: ConstraintFunction;
  type: ConstraintType;
  flexibility: ConstraintFlexibility;
  description: string;
  reason: string;
  examples: {
    valid: string[];
    invalid?: string[];
  };
}

export interface ConstraintStructure {
  function: ConstraintFunction;
  type: ConstraintType;
  flexibility: ConstraintFlexibility;
}

export interface Violation {
  constraintType: string;
  explanation: string;
}

export interface ViolationState {
  violations: Violation[];
  sentContent: string;
}

export interface StoryResponse {
  chatId: string;
  para?: string;
  question?: string;
  choices?: string[];
  eos?: string | boolean;
  constraints?: Constraint[];
  plot?: string;
  title?: string;
}

export type MessageSender = 'user' | 'ai';

export interface Message {
  id: number;
  content: string;
  sender: MessageSender;
}

export interface ExpandingCardProps {
  title: string;
  description: string;
  image: string | StaticImageData;
  link: string;
}

export interface Choice {
  description: string;
  options: string[];
  selected?: string;
}

export type StoryContext = {
  story: string[];
  lastChoices: string[];
  lastQuestion?: string;
  correctAnswers?: number;
  originalPrompt?: string;
};

export type ChatInterfaceProps = {
  storyId: string;
};

export interface ConstraintsPanelProps {
  constraints: Constraint[];
  newConstraints: Constraint[];
  violationsList: ViolationState[];
  constraintFilter: string;
  activeTab: 'all' | 'new' | 'violations';
  setActiveTab: (tab: 'all' | 'new' | 'violations') => void;
  setConstraintFilter: (filter: string) => void;
  onEditConstraint?: (constraint: Constraint) => void;
}

export interface ConstraintCardProps {
  constraint: Constraint;
  isNew: boolean;
  onEditConstraint?: (constraint: Constraint) => void;
}

export type GPTMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};
