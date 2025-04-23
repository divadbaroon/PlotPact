import React from 'react';
import { BookOpen, CheckCircle2, AlertCircle, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Constraint, ViolationState, ConstraintsPanelProps, ConstraintCardProps } from '@/types';

const ConstraintsPanel: React.FC<ConstraintsPanelProps> = ({
  constraints,
  newConstraints,
  violationsList,
  constraintFilter,
  activeTab,
  setActiveTab,
  setConstraintFilter,
  onEditConstraint
}) => {
  return (
    <div className='bg-white border rounded-lg shadow-md overflow-hidden'>
      {/* Tab Navigation */}
      <div className='flex border-b'>
        <button
          className={`flex-1 px-4 py-2 text-sm font-medium cursor-pointer ${
            activeTab === 'all'
              ? 'bg-gray-50 border-b-2 border-indigo-500'
              : 'text-gray-600 hover:bg-gray-50'
          } transition-all duration-200 hover:shadow-sm`}
          onClick={() => setActiveTab('all')}
        >
          <div className='flex items-center justify-center gap-2'>
            <BookOpen
              className={`h-4 w-4 ${
                activeTab === 'all' ? 'text-indigo-600' : ''
              } transition-colors duration-200`}
            />
            <span className={activeTab === 'all' ? 'text-indigo-700' : ''}>
              All Constraints
            </span>
            <Badge
              variant='outline'
              className={`ml-1 ${
                activeTab === 'all'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'bg-gray-100'
              } transition-colors duration-200`}
            >
              {constraints.length}
            </Badge>
          </div>
        </button>

        <button
          className={`flex-1 px-4 py-2 text-sm font-medium cursor-pointer ${
            activeTab === 'new'
              ? 'bg-gray-50 border-b-2 border-green-500'
              : 'text-gray-600 hover:bg-gray-50'
          } transition-all duration-200 hover:shadow-sm`}
          onClick={() => setActiveTab('new')}
        >
          <div className='flex items-center justify-center gap-2'>
            <CheckCircle2
              className={`h-4 w-4 ${
                activeTab === 'new' ? 'text-green-600' : ''
              } transition-colors duration-200`}
            />
            <span className={activeTab === 'new' ? 'text-green-700' : ''}>
              New Constraints
            </span>
            {newConstraints.length > 0 && (
              <Badge
                variant='outline'
                className={`ml-1 ${
                  activeTab === 'new'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100'
                } transition-colors duration-200`}
              >
                {newConstraints.length}
              </Badge>
            )}
          </div>
        </button>

        <button
          className={`flex-1 px-4 py-2 text-sm font-medium cursor-pointer ${
            activeTab === 'violations'
              ? 'bg-red-50 border-b-2 border-red-500'
              : violationsList.length > 0
              ? 'text-red-700 hover:bg-red-50 animate-pulse'
              : 'text-gray-600 hover:bg-gray-50'
          } transition-all duration-200 hover:shadow-sm`}
          onClick={() => setActiveTab('violations')}
        >
          <div className='flex items-center justify-center gap-2'>
            <AlertCircle
              className={`h-4 w-4 ${
                activeTab === 'violations' || violationsList.length > 0
                  ? 'text-red-600'
                  : ''
              } transition-colors duration-200`}
            />
            <span
              className={activeTab === 'violations' ? 'text-red-700' : ''}
            >
              Violations
            </span>
            {violationsList.length > 0 && (
              <Badge
                variant='destructive'
                className='ml-1 bg-red-600 text-white'
              >
                {violationsList.length}
              </Badge>
            )}
          </div>
        </button>
      </div>

      {/* Filter Controls */}
      {activeTab !== 'violations' && (
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-xs font-medium text-gray-700">Filter by:</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
            <Badge 
              variant={constraintFilter === 'all' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setConstraintFilter('all')}
            >
              All
            </Badge>
            
            <div className="relative group inline-block">
              <Badge 
                variant={constraintFilter === 'exclusionary' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setConstraintFilter('exclusionary')}
              >
                Exclusionary
              </Badge>
              <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1 pointer-events-none">
                Rules about what NOT to do in the story
              </div>
            </div>
            
            <div className="relative group inline-block">
              <Badge 
                variant={constraintFilter === 'focusing' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setConstraintFilter('focusing')}
              >
                Focusing
              </Badge>
              <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1 pointer-events-none">
                Rules about what MUST be included
              </div>
            </div>
            
            <div className="relative group inline-block">
              <Badge 
                variant={constraintFilter === 'channel' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setConstraintFilter('channel')}
              >
                Channel
              </Badge>
              <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1 pointer-events-none">
                Broad constraints about setting or time period
              </div>
            </div>
            
            <div className="relative group inline-block">
              <Badge 
                variant={constraintFilter === 'anchor' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setConstraintFilter('anchor')}
              >
                Anchor
              </Badge>
              <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1 pointer-events-none">
                Specific elements like characters or objects
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className='max-h-[60vh] overflow-y-auto p-6'>
        {activeTab === 'all' && (
          <AllConstraints 
            constraints={constraints} 
            constraintFilter={constraintFilter}
            onEditConstraint={onEditConstraint}
          />
        )}

        {activeTab === 'new' && (
          <NewConstraints 
            newConstraints={newConstraints}
            constraintFilter={constraintFilter}
            onEditConstraint={onEditConstraint}
          />
        )}

        {activeTab === 'violations' && (
          <ViolationsList 
            violationsList={violationsList} 
          />
        )}
      </div>
    </div>
  );
};

// Sub-components
const AllConstraints: React.FC<{ 
  constraints: Constraint[], 
  constraintFilter: string,
  onEditConstraint?: (constraint: Constraint) => void
}> = ({ constraints, constraintFilter, onEditConstraint }) => {
  if (constraints.length === 0) {
    return (
      <div className='text-center py-12 px-8'>
        <div className='bg-gray-50 rounded-lg p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200'>
          <BookOpen className='h-16 w-16 text-gray-300 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-700 mb-3'>
            No Constraints Yet
          </h3>
          <p className='text-gray-500 max-w-xl mx-auto'>
            As your story progresses, important details will be
            tracked here to maintain consistency.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {constraints
        .filter(constraint => 
          constraintFilter === 'all' || 
          constraint.function === constraintFilter ||
          constraint.type === constraintFilter
        )
        .map((constraint, index) => (
          <ConstraintCard 
            key={index} 
            constraint={constraint} 
            isNew={false}
            onEditConstraint={onEditConstraint}
          />
        ))
      }
    </div>
  );
};

const NewConstraints: React.FC<{ 
  newConstraints: Constraint[],
  constraintFilter: string,
  onEditConstraint?: (constraint: Constraint) => void
}> = ({ newConstraints, constraintFilter, onEditConstraint }) => {
  if (newConstraints.length === 0) {
    return (
      <div className='text-center py-12 px-8'>
        <div className='bg-gray-50 rounded-lg p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200'>
          <CheckCircle2 className='h-16 w-16 text-gray-300 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-700 mb-3'>
            No New Constraints
          </h3>
          <p className='text-gray-500 max-w-xl mx-auto'>
            New story constraints will appear here when they&apos;re
            discovered in your latest additions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {newConstraints
        .filter(constraint => 
          constraintFilter === 'all' || 
          constraint.function === constraintFilter ||
          constraint.type === constraintFilter
        )
        .map((constraint, index) => (
          <ConstraintCard 
            key={index} 
            constraint={constraint} 
            isNew={true}
            onEditConstraint={onEditConstraint}
          />
        ))}
    </div>
  );
};

const ViolationsList: React.FC<{ violationsList: ViolationState[] }> = ({ violationsList }) => {
  if (violationsList.length === 0) {
    return (
      <div className='text-center py-12 px-8'>
        <div className='bg-gray-50 rounded-lg p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200'>
          <AlertCircle className='h-16 w-16 text-gray-300 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-700 mb-3'>
            No Violations Recorded
          </h3>
          <p className='text-gray-500 max-w-xl mx-auto'>
            Your story is progressing smoothly without any consistency
            issues. When violations occur, they will appear here with
            detailed explanations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {violationsList.map((v, i) => (
        <div
          key={i}
          className='border-2 border-red-300 rounded-md bg-red-50 overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-red-400'
        >
          <div className='p-3 bg-red-100'>
            <div className='flex items-center gap-2 mb-2'>
              <AlertCircle className='h-5 w-5 text-red-600' />
              <p className='font-semibold text-sm text-red-800'>
                Rejected Input:
              </p>
            </div>
            <p className='text-gray-800 text-sm mt-1 bg-white p-3 rounded border-2 border-red-300 hover:border-red-400 transition-colors'>
              {v.sentContent}
            </p>
          </div>
          <div className='p-3'>
            <div className='flex items-center gap-2 mb-2'>
              <AlertCircle className='h-5 w-5 text-red-600' />
              <p className='font-semibold text-sm text-red-800'>
                Violations ({v.violations.length}):
              </p>
            </div>
            {v.violations.map((violation, j) => (
              <div
                key={j}
                className='mb-3 bg-white p-3 rounded border-2 border-red-300 hover:border-red-400 transition-colors last:mb-0 hover:bg-red-50'
              >
                <p className='text-sm font-semibold text-red-700 mb-1'>
                  {violation.constraintType}
                </p>
                <p className='text-sm text-gray-700'>
                  {violation.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ConstraintCard: React.FC<ConstraintCardProps> = ({ constraint }) => {
  const cardClass = 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300';
  
  const isEditable = constraint.flexibility === 'flexible' || constraint.flexibility === 'faux-fixed';
  
  return (
    <div
      className={`p-3 rounded-md shadow-sm border ${cardClass} transition-colors hover:shadow-md cursor-default`}
    >
      <div className='flex items-start'>
        <div className="flex-1">
          {/* Constraint title/description */}
          <p className="font-medium text-sm text-gray-800 mb-1">
            {constraint.description}
          </p>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="relative group">
              <Badge 
                variant="outline" 
                className={isEditable
                  ? 'text-xs bg-blue-100 text-blue-700 border-blue-200 cursor-pointer'
                  : 'text-xs bg-gray-100 text-gray-700 border-gray-200 cursor-pointer'
                }
              >
                {isEditable ? 'Variable' : 'Fixed'}
              </Badge>
              <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1">
                {isEditable
                  ? "This constraint has some flexibility in interpretation" 
                  : "This constraint cannot be changed"}
              </div>
            </div>
            
            {/* Function Badge with Tooltip */}
            {constraint.function && (
              <div className="relative group">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    constraint.function === 'exclusionary' 
                      ? 'bg-red-50 text-red-700 border-red-200 cursor-pointer' 
                      : 'bg-green-50 text-green-700 border-green-200 cursor-pointer'
                  }`}
                >
                  {constraint.function === 'exclusionary' ? 'Exclusionary' : 'Focusing'}
                </Badge>
                <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1">
                  {constraint.function === 'exclusionary' 
                    ? "Rules about what NOT to do in the story" 
                    : "Rules about what MUST be included"}
                </div>
              </div>
            )}
            
            {/* Type Badge with Tooltip */}
            {constraint.type && (
              <div className="relative group">
                <Badge 
                  variant="outline" 
                  className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200 cursor-pointer"
                >
                  {constraint.type}
                </Badge>
                <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1">
                  {constraint.type === 'channel' 
                    ? "Broad constraints about setting or time period" 
                    : "Specific elements like characters or objects"}
                </div>
              </div>
            )}
          </div>
          
          {/* Constraint reason */}
          <p className='text-xs text-gray-600'>
            {constraint.reason}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConstraintsPanel;