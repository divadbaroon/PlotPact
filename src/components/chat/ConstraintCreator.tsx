import React, { useState, useRef, useEffect } from 'react';
import { Info, Dice5, RefreshCcw, Trash2, CheckCircle2 } from 'lucide-react';
import ConstraintCard from '@/components/chat/ConstraintCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Constraint } from '@/types';

interface ConstraintCreatorProps {
  onAddConstraint: (constraint: Constraint) => void;
  onClose?: () => void;
}

const ConstraintCreator: React.FC<ConstraintCreatorProps> = ({ 
  onAddConstraint,
  onClose 
}) => {
  const [functionType, setFunctionType] = useState<
    Constraint['function'] | null
  >(null);
  const [constraintType, setConstraintType] = useState<
    Constraint['type'] | null
  >(null);
  const [flexibility, setFlexibility] = useState<
    Constraint['flexibility'] | null
  >(null);
  const [description, setDescription] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [validExample, setValidExample] = useState<string>('');
  const [invalidExample, setInvalidExample] = useState<string>('');
  const [generatedConstraint, setGeneratedConstraint] =
    useState<Constraint | null>(null);
  const [infoPopover, setInfoPopover] = useState<string | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);

  const randomizeSelections = () => {
    const functions: Constraint['function'][] = ['focusing', 'exclusionary'];
    const types: Constraint['type'][] = ['channel', 'anchor'];
    const flexibilities: Constraint['flexibility'][] = ['fixed','flexible'];

    setFunctionType(functions[Math.floor(Math.random() * functions.length)]);
    setConstraintType(types[Math.floor(Math.random() * types.length)]);
    setFlexibility(
      flexibilities[Math.floor(Math.random() * flexibilities.length)]
    );
  };

  const generatePlaceholderConstraint = (): Constraint => {
    // Use custom values if provided, otherwise use defaults
    return {
      id: crypto.randomUUID(),
      description: description || 'The story must include a mysterious old map.',
      function: functionType!,
      type: constraintType!,
      flexibility: flexibility!,
      reason: reason || 'This constraint adds a sense of discovery and connects to the theme of exploration.',
      examples: {
        valid: [validExample || 'The character finds a torn map leading to a hidden cave.'],
        invalid: [invalidExample || 'There is no mention of any map throughout the story.'],
      },
    };
  };

  const handleGenerateConstraint = () => {
    if (!functionType || !constraintType || !flexibility) return;
    const constraint = generatePlaceholderConstraint();
    setGeneratedConstraint(constraint);
  };

  const handleAcceptConstraint = () => {
    if (!generatedConstraint) return;
    onAddConstraint(generatedConstraint);
    resetForm();
    if (onClose) {
      onClose();
    }
  };

  const handleDiscardConstraint = () => {
    resetForm();
  };

  const resetForm = () => {
    setGeneratedConstraint(null);
    setFunctionType(null);
    setConstraintType(null);
    setFlexibility(null);
    setDescription('');
    setReason('');
    setValidExample('');
    setInvalidExample('');
  };

  const handleRegenerateConstraint = () => {
    const constraint = generatePlaceholderConstraint();
    setGeneratedConstraint(constraint);
  };

  const isGenerateDisabled = !functionType || !constraintType || !flexibility;

  const infoDescriptions: Record<string, string> = {
    function: `Focusing: Specifies what must be included — e.g., a theme, event, or arc.
Exclusionary: Specifies what must NOT happen — e.g., avoiding violence or removing a genre.`,
    type: `Channel: Broad guidance — e.g., must take place in space or the 1800s.
Anchor: Specific anchors — e.g., a named object, character, or artifact.`,
    flexibility: `Fixed: Must be followed without changes.
Faux-Fixed: Appears fixed but can be altered with proper justification.
Flexible: Open to interpretation and negotiation.`,
    description: `The main statement of the constraint - what must be followed or avoided.`,
    reason: `Why this constraint is important for the story's consistency.`,
    examples: `Examples help clarify how to follow or not follow the constraint.`
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setInfoPopover(null);
      }
    }
    if (infoPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [infoPopover]);

  return (
    <div className='bg-white border rounded-lg shadow-md p-6 space-y-6 relative'>
      <h2 className='text-lg font-semibold text-gray-800 mb-4'>
        Create a New Constraint
      </h2>

      {/* Constraint Creation UI */}
      <div className='space-y-6'>
        {/* Function Type */}
        <div className='relative'>
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-sm font-medium text-gray-700'>
              Constraint Function
            </span>
            <button
              onClick={() =>
                setInfoPopover(infoPopover === 'function' ? null : 'function')
              }
            >
              <Info className='h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer' />
            </button>
          </div>
          <div className='flex gap-3'>
            <Badge
              variant={functionType === 'focusing' ? 'default' : 'outline'}
              className='cursor-pointer'
              onClick={() => setFunctionType('focusing')}
            >
              Focusing
            </Badge>
            <Badge
              variant={functionType === 'exclusionary' ? 'default' : 'outline'}
              className='cursor-pointer'
              onClick={() => setFunctionType('exclusionary')}
            >
              Exclusionary
            </Badge>
          </div>
          {infoPopover === 'function' && (
            <div
              ref={infoRef}
              className='absolute top-10 left-0 bg-white border shadow-lg rounded-md p-4 w-80 z-20 text-sm text-gray-700 whitespace-pre-wrap'
            >
              {infoDescriptions.function}
            </div>
          )}
        </div>

        {/* Constraint Type */}
        <div className='relative'>
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-sm font-medium text-gray-700'>
              Constraint Type
            </span>
            <button
              onClick={() =>
                setInfoPopover(infoPopover === 'type' ? null : 'type')
              }
            >
              <Info className='h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer' />
            </button>
          </div>
          <div className='flex gap-3'>
            <Badge
              variant={constraintType === 'channel' ? 'default' : 'outline'}
              className='cursor-pointer'
              onClick={() => setConstraintType('channel')}
            >
              Channel
            </Badge>
            <Badge
              variant={constraintType === 'anchor' ? 'default' : 'outline'}
              className='cursor-pointer'
              onClick={() => setConstraintType('anchor')}
            >
              Anchor
            </Badge>
          </div>
          {infoPopover === 'type' && (
            <div
              ref={infoRef}
              className='absolute top-10 left-0 bg-white border shadow-lg rounded-md p-4 w-80 z-20 text-sm text-gray-700 whitespace-pre-wrap'
            >
              {infoDescriptions.type}
            </div>
          )}
        </div>

        {/* Flexibility */}
        <div className='relative'>
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-sm font-medium text-gray-700'>
              Flexibility
            </span>
            <button
              onClick={() =>
                setInfoPopover(
                  infoPopover === 'flexibility' ? null : 'flexibility'
                )
              }
            >
              <Info className='h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer' />
            </button>
          </div>
          <div className='flex gap-3'>
            <Badge
              variant={flexibility === 'fixed' ? 'default' : 'outline'}
              className='cursor-pointer'
              onClick={() => setFlexibility('fixed')}
            >
              Fixed
            </Badge>
            <Badge
              variant={flexibility === 'flexible' ? 'default' : 'outline'}
              className='cursor-pointer'
              onClick={() => setFlexibility('flexible')}
            >
              Flexible
            </Badge>
          </div>
          {infoPopover === 'flexibility' && (
            <div
              ref={infoRef}
              className='absolute top-10 left-0 bg-white border shadow-lg rounded-md p-4 w-80 z-20 text-sm text-gray-700 whitespace-pre-wrap'
            >
              {infoDescriptions.flexibility}
            </div>
          )}
        </div>

        {/* Description */}
        <div className='relative'>
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-sm font-medium text-gray-700'>
              Description
            </span>
            <button
              onClick={() =>
                setInfoPopover(
                  infoPopover === 'description' ? null : 'description'
                )
              }
            >
              <Info className='h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer' />
            </button>
          </div>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what must be maintained in the story..."
            className="w-full min-h-[80px]"
          />
          {infoPopover === 'description' && (
            <div
              ref={infoRef}
              className='absolute top-10 left-0 bg-white border shadow-lg rounded-md p-4 w-80 z-20 text-sm text-gray-700 whitespace-pre-wrap'
            >
              {infoDescriptions.description}
            </div>
          )}
        </div>

        {/* Reason */}
        <div className='relative'>
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-sm font-medium text-gray-700'>
              Reason
            </span>
            <button
              onClick={() =>
                setInfoPopover(
                  infoPopover === 'reason' ? null : 'reason'
                )
              }
            >
              <Info className='h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer' />
            </button>
          </div>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why is this constraint important for the story?"
            className="w-full min-h-[80px]"
          />
          {infoPopover === 'reason' && (
            <div
              ref={infoRef}
              className='absolute top-10 left-0 bg-white border shadow-lg rounded-md p-4 w-80 z-20 text-sm text-gray-700 whitespace-pre-wrap'
            >
              {infoDescriptions.reason}
            </div>
          )}
        </div>

        {/* Examples */}
        <div className='relative'>
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-sm font-medium text-gray-700'>
              Examples
            </span>
            <button
              onClick={() =>
                setInfoPopover(
                  infoPopover === 'examples' ? null : 'examples'
                )
              }
            >
              <Info className='h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer' />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <span className='text-xs font-medium text-green-700 block mb-1'>
                Valid Example:
              </span>
              <Textarea
                value={validExample}
                onChange={(e) => setValidExample(e.target.value)}
                placeholder="An example that follows this constraint..."
                className="w-full min-h-[60px] border-green-200"
              />
            </div>
            
            <div>
              <span className='text-xs font-medium text-red-700 block mb-1'>
                Invalid Example:
              </span>
              <Textarea
                value={invalidExample}
                onChange={(e) => setInvalidExample(e.target.value)}
                placeholder="An example that violates this constraint..."
                className="w-full min-h-[60px] border-red-200"
              />
            </div>
          </div>
          
          {infoPopover === 'examples' && (
            <div
              ref={infoRef}
              className='absolute top-10 left-0 bg-white border shadow-lg rounded-md p-4 w-80 z-20 text-sm text-gray-700 whitespace-pre-wrap'
            >
              {infoDescriptions.examples}
            </div>
          )}
        </div>

        {/* Generate and Random Buttons */}
        <div className='flex gap-4'>
          <button
            onClick={randomizeSelections}
            className='flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium'
          >
            <Dice5 className='h-4 w-4' /> Random Selections
          </button>
          <button
            onClick={handleGenerateConstraint}
            disabled={isGenerateDisabled}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isGenerateDisabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Generate Constraint
          </button>
        </div>
      </div>

      {/* Created Constraint Section */}
      <div className='pt-6 border-t mt-8'>
        <h3 className='text-md font-semibold text-gray-700 mb-4'>
          Created Constraint
        </h3>

        {generatedConstraint ? (
          <div className='space-y-6'>
            <ConstraintCard isNew={false} constraint={generatedConstraint} />
            <div className='flex gap-4'>
              <button
                onClick={handleAcceptConstraint}
                className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium'
              >
                <CheckCircle2 className='h-4 w-4' /> Add Constraint
              </button>
              <button
                onClick={handleDiscardConstraint}
                className='flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium'
              >
                <Trash2 className='h-4 w-4' /> Discard
              </button>
              <button
                onClick={handleRegenerateConstraint}
                className='flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition-colors text-sm font-medium'
              >
                <RefreshCcw className='h-4 w-4' /> Regenerate
              </button>
            </div>
          </div>
        ) : (
          <div className='text-sm text-gray-500 italic'>
            No constraint generated yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ConstraintCreator;