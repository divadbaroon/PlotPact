'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Info,
  Dice5,
  RefreshCcw,
  Trash2,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import ConstraintCard from '@/components/chat/ConstraintCard';
import { Badge } from '@/components/ui/badge';
import {
  Constraint,
  ConstraintFlexibility,
  ConstraintFunction,
  ConstraintType,
} from '@/types';

import { createConstraint } from '@/lib/actions/constraintManager';

interface ConstraintCreatorProps {
  onAddConstraint: (constraints: Constraint[]) => void;
  onClose?: () => void;
  storyContext: string[];
  existingConstraints: Constraint[];
}

const ConstraintCreator: React.FC<ConstraintCreatorProps> = ({
  onAddConstraint,
  onClose,
  storyContext,
  existingConstraints,
}) => {
  const [functionType, setFunctionType] = useState<ConstraintFunction | null>(
    null
  );
  const [constraintType, setConstraintType] = useState<ConstraintType | null>(
    null
  );
  const [flexibility, setFlexibility] = useState<ConstraintFlexibility | null>(
    null
  );
  const [constraintCount, setConstraintCount] = useState<number>(1);
  const [generatedConstraints, setGeneratedConstraints] = useState<
    Constraint[] | null
  >(null);
  const [infoPopover, setInfoPopover] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const infoRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  const randomizeSelections = () => {
    const functions: ConstraintFunction[] = ['focusing', 'exclusionary'];
    const types: ConstraintType[] = ['channel', 'anchor'];
    const flexibilities: ConstraintFlexibility[] = ['fixed', 'flexible'];

    setFunctionType(functions[Math.floor(Math.random() * functions.length)]);
    setConstraintType(types[Math.floor(Math.random() * types.length)]);
    setFlexibility(
      flexibilities[Math.floor(Math.random() * flexibilities.length)]
    );
  };

  const generateConstraints = async () => {
    const constraintSpecifics = {
      function: functionType,
      type: constraintType,
      flexibility,
    };
    return await createConstraint(
      storyContext,
      existingConstraints,
      constraintSpecifics,
      constraintCount
    );
  };

  const handleGenerateConstraint = async () => {
    if (!functionType || !constraintType || !flexibility) return;

    setGeneratedConstraints(null);
    setIsLoading(true);
    try {
      const constraints = await generateConstraints();
      setGeneratedConstraints(constraints);
      scrollToBottom();
    } catch (err) {
      console.error('Error generating constraints:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptConstraint = () => {
    if (!generatedConstraints) return;
    onAddConstraint(generatedConstraints);
    resetForm();
    if (onClose) onClose();
  };

  const handleDiscardConstraint = () => {
    resetForm();
  };

  const handleRegenerateConstraints = async () => {
    setGeneratedConstraints(null);
    setIsLoading(true);
    try {
      const constraints = await generateConstraints();
      setGeneratedConstraints(constraints);
      scrollToBottom();
    } catch (err) {
      console.error('Error regenerating constraints:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setGeneratedConstraints(null);
    setFunctionType(null);
    setConstraintType(null);
    setFlexibility(null);
    setConstraintCount(1);
  };

  const isGenerateDisabled =
    !functionType || !constraintType || !flexibility || isLoading;

  const infoDescriptions: Record<string, string> = {
    function: `Focusing: Specifies what must be included — e.g., a theme, event, or arc.\nExclusionary: Specifies what must NOT happen — e.g., avoiding violence or removing a genre.`,
    type: `Channel: Broad guidance — e.g., must take place in space or the 1800s.\nAnchor: Specific anchors — e.g., a named object, character, or artifact.`,
    flexibility: `Fixed: Must be followed without changes.\nFaux-Fixed: Appears fixed but can be altered with proper justification.\nFlexible: Open to interpretation and negotiation.`,
    description: `The main statement of the constraint - what must be followed or avoided.`,
    reason: `Why this constraint is important for the story's consistency.`,
    examples: `Examples help clarify how to follow or not follow the constraint.`,
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
    <div
      ref={containerRef}
      className='bg-white border rounded-lg shadow-md p-6 space-y-6 relative max-h-[90vh] overflow-y-auto'
    >
      <h2 className='text-lg font-semibold text-gray-800 mb-4'>
        Create a New Constraints
      </h2>

      {/* Constraint Function */}
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
          <span className='text-sm font-medium text-gray-700'>Flexibility</span>
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

      {/* Constraint Count Selector */}
      <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
        <label
          htmlFor='constraint-count'
          className='text-sm font-medium text-gray-700'
        >
          Number of Constraints
        </label>
        <select
          id='constraint-count'
          value={constraintCount}
          onChange={(e) => setConstraintCount(Number(e.target.value))}
          className='w-24 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500'
        >
          {[1, 2, 3, 4].map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4'>
        <button
          onClick={randomizeSelections}
          className='flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium cursor-pointer'
        >
          <Dice5 className='h-4 w-4' /> Random Selections
        </button>
        <button
          onClick={handleGenerateConstraint}
          disabled={isGenerateDisabled}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            isGenerateDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isLoading ? (
            <div className='flex items-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Generating...
            </div>
          ) : (
            'Generate Constraints'
          )}
        </button>
      </div>

      {isLoading && (
        <div className='flex items-center gap-2 mt-4 text-gray-600 text-sm'>
          <Loader2 className='h-4 w-4 animate-spin text-indigo-600' />
          <span>Generating constraints...</span>
        </div>
      )}

      {/* Created Constraint Section */}
      <div className='pt-6 border-t mt-8'>
        <h3 className='text-md font-semibold text-gray-700 mb-4'>
          Created Constraints
        </h3>

        {generatedConstraints && generatedConstraints.length > 0 ? (
          <div className='space-y-6'>
            {generatedConstraints.map((constraint, idx) => (
              <ConstraintCard
                key={constraint.id ?? idx}
                isNew={false}
                constraint={constraint}
              />
            ))}
            <div className='flex gap-4'>
              <button
                onClick={handleAcceptConstraint}
                className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer'
              >
                <CheckCircle2 className='h-4 w-4' /> Add Constraints
              </button>
              <button
                onClick={handleDiscardConstraint}
                className='flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium cursor-pointer'
              >
                <Trash2 className='h-4 w-4' /> Discard
              </button>
              <button
                onClick={handleRegenerateConstraints}
                disabled={isLoading}
                className='flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
              >
                <RefreshCcw className='h-4 w-4' /> Regenerate
              </button>
            </div>
          </div>
        ) : (
          <div className='text-sm text-gray-500 italic'>
            No constraints generated yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ConstraintCreator;
