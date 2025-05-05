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
  function: ConstraintFunction | null;
  type: ConstraintType | null;
  flexibility: ConstraintFlexibility | null;
}

export interface Violation {
  constraintType: string;
  explanation: string;
  violatingContent?: string;
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
  onDeleteConstraint?: (constraint: Constraint) => void;
  violationsViewed?: boolean;
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

export interface ConstraintCardProps {
  constraint: Constraint;
  isNew?: boolean;
  onEditConstraint?: (constraint: Constraint) => void;
  onDeleteConstraint?: (constraint: Constraint) => void;
}

export interface DeleteConstraintDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  constraint: Constraint;
  onConfirmDelete: (constraint: Constraint) => void;
}

export type SidebarHeaderProps = {
  activeSection: "overview" | "constraints" | "objectives"
  setActiveSection: (section: "overview" | "constraints" | "objectives") => void
  constraintsCount: number
}

export type OverviewPanelProps = {
  title: string
  plot: string
  image: string
  onEditClick: () => void
}

export type Objective = {
  id: string
  description: string
  completed: boolean
}

export type ObjectivesPanelProps = {
  objectives: Objective[]
  onAddObjective: (objective: Objective) => void
  onToggleObjective: (id: string) => void
  onDeleteObjective: (id: string) => void
}