import React from 'react';
import { BookOpen, CheckCircle2, AlertCircle, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type {
  Constraint,
  ViolationState,
  ConstraintsPanelProps,
} from '@/types';
import ConstraintCard from './ConstraintCard';

const ConstraintsPanel: React.FC<ConstraintsPanelProps> = ({
  constraints,
  newConstraints,
  violationsList,
  pastViolations,
  constraintFilter,
  activeTab,
  setActiveTab,
  setConstraintFilter,
  onDeleteConstraint,  
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
            activeTab === 'violations' && violationsList.length > 0
              ? 'bg-red-50 border-b-2 border-red-500 text-red-700' 
              : activeTab === 'violations'
              ? 'bg-gray-50 border-b-2 border-gray-500 text-gray-700' 
              : violationsList.length > 0
              ? 'text-red-700 hover:bg-red-50' 
              : 'text-gray-600 hover:bg-gray-50' 
          } transition-all duration-200 hover:shadow-sm`}
          onClick={() => setActiveTab('violations')}
        >
          <div className='flex items-center justify-center gap-2'>
            <AlertCircle
              className={`h-4 w-4 ${
                violationsList.length > 0
                  ? 'text-red-600' 
                  : activeTab === 'violations'
                  ? 'text-gray-600'
                  : ''
              } transition-colors duration-200`}
            />
            <span className={violationsList.length > 0 ? 'text-red-700' : activeTab === 'violations' ? 'text-gray-700' : ''}>
              Violations
            </span>
          </div>
        </button>
      </div>

      {/* Filter Controls */}
      {activeTab !== 'violations' && (
        <div className='p-3 border-b border-gray-200 bg-gray-50'>
          <div className='flex flex-wrap items-center gap-2'>
            <div className='flex items-center'>
              <Filter className='h-4 w-4 text-gray-500 mr-2' />
              <span className='text-xs font-medium text-gray-700'>
                Filter by:
              </span>
            </div>

            <div className='flex flex-wrap gap-1 items-center'>
              <Badge
                variant={constraintFilter === 'all' ? 'default' : 'outline'}
                className='cursor-pointer'
                onClick={() => setConstraintFilter('all')}
              >
                All
              </Badge>

              <div className='relative group inline-block'>
                <Badge
                  variant={
                    constraintFilter === 'exclusionary' ? 'default' : 'outline'
                  }
                  className='cursor-pointer'
                  onClick={() => setConstraintFilter('exclusionary')}
                >
                  Exclusionary
                </Badge>
                <div className='absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1 pointer-events-none'>
                  Specifies what must not appear in the story. These remove
                  common ideas to push you in new, less obvious directions.
                </div>
              </div>

              <div className='relative group inline-block'>
                <Badge
                  variant={
                    constraintFilter === 'focusing' ? 'default' : 'outline'
                  }
                  className='cursor-pointer'
                  onClick={() => setConstraintFilter('focusing')}
                >
                  Focusing
                </Badge>
                <div className='absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1 pointer-events-none'>
                  Specifies what must be included in the story. These guide your
                  creativity by pointing you toward particular elements or
                  themes.
                </div>
              </div>

              <div className='relative group inline-block'>
                <Badge
                  variant={
                    constraintFilter === 'channel' ? 'default' : 'outline'
                  }
                  className='cursor-pointer'
                  onClick={() => setConstraintFilter('channel')}
                >
                  Channel
                </Badge>
                <div className='absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1 pointer-events-none'>
                  A broad theme or category that shapes story direction.
                  Channels give freedom while guiding narrative style or topic.
                </div>
              </div>

              <div className='relative group inline-block'>
                <Badge
                  variant={
                    constraintFilter === 'anchor' ? 'default' : 'outline'
                  }
                  className='cursor-pointer'
                  onClick={() => setConstraintFilter('anchor')}
                >
                  Anchor
                </Badge>
                <div className='absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1 pointer-events-none'>
                  A specific item, phrase, or concept that acts as a creative
                  trigger. Anchors narrow focus and inspire concrete ideas.
                </div>
              </div>

              <div className='relative group inline-block'>
                <Badge
                  variant={
                    constraintFilter === 'flexible' ? 'default' : 'outline'
                  }
                  className='cursor-pointer'
                  onClick={() => setConstraintFilter('flexible')}
                >
                  Flexible
                </Badge>
                <div className='absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1 pointer-events-none'>
                  This constraint is more like a suggestion. You can reinterpret
                  or bend it if needed to serve your story.
                </div>
              </div>

              <div className='relative group inline-block'>
                <Badge
                  variant={constraintFilter === 'fixed' ? 'default' : 'outline'}
                  className='cursor-pointer'
                  onClick={() => setConstraintFilter('fixed')}
                >
                  Fixed
                </Badge>
                <div className='absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1 pointer-events-none'>
                  This constraint must be strictly followed. It sets a hard rule
                  that defines the creative boundaries.
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
            onDeleteConstraint={onDeleteConstraint}
          />
        )}

        {activeTab === 'new' && (
          <NewConstraints
            newConstraints={newConstraints}
            constraintFilter={constraintFilter}
            onDeleteConstraint={onDeleteConstraint}
          />
        )}

        {activeTab === 'violations' && (
          <ViolationsList 
            violationsList={violationsList} 
            pastViolations={pastViolations}
          />
        )}
      </div>
    </div>
  );
};

// Sub-components
const AllConstraints: React.FC<{
  constraints: Constraint[];
  constraintFilter: string;
  onEditConstraint?: (constraint: Constraint) => void;
  onDeleteConstraint?: (constraint: Constraint) => void;
}> = ({
  constraints,
  constraintFilter,
  onEditConstraint,
  onDeleteConstraint,
}) => {
  if (constraints.length === 0) {
    return (
      <div className='text-center py-12 px-8'>
        <div className='bg-gray-50 rounded-lg p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200'>
          <BookOpen className='h-16 w-16 text-gray-300 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-700 mb-3'>
            No Constraints Yet
          </h3>
          <p className='text-gray-500 max-w-xl mx-auto'>
            As your story progresses, important details will be tracked here to
            maintain consistency.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {constraints
        .filter(
          (constraint) =>
            constraintFilter === 'all' ||
            constraint.function === constraintFilter ||
            constraint.type === constraintFilter ||
            constraint.flexibility === constraintFilter
        )
        .map((constraint, index) => (
          <ConstraintCard
            key={index}
            constraint={constraint}
            isNew={false}
            onEditConstraint={onEditConstraint}
            onDeleteConstraint={onDeleteConstraint}
          />
        ))}
    </div>
  );
};

const NewConstraints: React.FC<{
  newConstraints: Constraint[];
  constraintFilter: string;
  onEditConstraint?: (constraint: Constraint) => void;
  onDeleteConstraint?: (constraint: Constraint) => void;
}> = ({
  newConstraints,
  constraintFilter,
  onEditConstraint,
  onDeleteConstraint,
}) => {
  if (newConstraints.length === 0) {
    return (
      <div className='text-center py-12 px-8'>
        <div className='bg-gray-50 rounded-lg p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200'>
          <CheckCircle2 className='h-16 w-16 text-gray-300 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-700 mb-3'>
            No New Constraints
          </h3>
          <p className='text-gray-500 max-w-xl mx-auto'>
            New story constraints will appear here when they&apos;re discovered
            in your latest additions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {newConstraints
        .filter(
          (constraint) =>
            constraintFilter === 'all' ||
            constraint.function === constraintFilter ||
            constraint.type === constraintFilter ||
            constraint.flexibility === constraintFilter
        )
        .map((constraint, index) => (
          <ConstraintCard
            key={index}
            constraint={constraint}
            isNew={true}
            onEditConstraint={onEditConstraint}
            onDeleteConstraint={onDeleteConstraint}
          />
        ))}
    </div>
  );
};

const ViolationsList: React.FC<{ 
  violationsList: ViolationState[], 
  pastViolations: ViolationState[] 
}> = ({ violationsList, pastViolations }) => {
  const hasNoViolations = violationsList.length === 0 && pastViolations.length === 0;
  
  if (hasNoViolations) {
    return (
      <div className='text-center py-12 px-8'>
        <div className='bg-gray-50 rounded-lg p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200'>
          <AlertCircle className='h-16 w-16 text-gray-300 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-700 mb-3'>
            No Violations Recorded
          </h3>
          <p className='text-gray-500 max-w-xl mx-auto'>
            Your story is progressing smoothly without any consistency issues.
            When violations occur, they will appear here with detailed
            explanations.
          </p>
        </div>
      </div>
    );
  }

  const ViolationCard = ({ v, index }: { v: ViolationState, index: number }) => (
    <div
      key={index}
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
            <p className='text-sm text-gray-700'>{violation.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className='space-y-8'>
      {/* Current Violations Section */}
      <div>
        <div className='flex items-center justify-between mb-4'>
          <h3 className={`text-sm font-semibold ${
            violationsList.length > 0 ? 'text-red-700' : 'text-gray-700'
          }`}>
            Current Violations
          </h3>
          <Badge 
            variant={violationsList.length > 0 ? 'destructive' : 'outline'}
            className={`${
              violationsList.length > 0 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {violationsList.length}
          </Badge>
        </div>
        
        {violationsList.length === 0 ? (
          <div className='text-center py-8 px-6'>
            <div className='bg-green-50 rounded-lg p-6 border border-green-200'>
              <CheckCircle2 className='h-12 w-12 text-green-400 mx-auto mb-3' />
              <p className='text-sm text-green-700'>No current violations</p>
              <p className='text-xs text-green-600 mt-1'>Your recent writing follows all constraints</p>
            </div>
          </div>
        ) : (
          <div className='space-y-4'>
            {violationsList.map((v, i) => (
              <ViolationCard key={i} v={v} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Past Violations Section */}
      <div>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-sm font-semibold text-gray-700'>Past Violations</h3>
          <Badge 
            variant='outline' 
            className='bg-gray-100 text-gray-700'
          >
            {pastViolations.length}
          </Badge>
        </div>
        
        {pastViolations.length === 0 ? (
          <div className='text-center py-8 px-6'>
            <div className='bg-gray-50 rounded-lg p-6 border border-gray-200'>
              <p className='text-sm text-gray-600'>No past violations</p>
              <p className='text-xs text-gray-500 mt-1'>History will appear here when violations are resolved</p>
            </div>
          </div>
        ) : (
          <div className='space-y-4'>
            {pastViolations.map((v, i) => (
              <div 
                key={i} 
                className='border-2 border-gray-300 rounded-md bg-gray-50 overflow-hidden opacity-75'
              >
                <div className='p-3 bg-gray-100'>
                  <div className='flex items-center gap-2 mb-2'>
                    <AlertCircle className='h-5 w-5 text-gray-500' />
                    <p className='font-semibold text-sm text-gray-700'>
                      Past Input:
                    </p>
                  </div>
                  <p className='text-gray-700 text-sm mt-1 bg-white p-3 rounded border-2 border-gray-300'>
                    {v.sentContent}
                  </p>
                </div>
                <div className='p-3'>
                  <div className='flex items-center gap-2 mb-2'>
                    <AlertCircle className='h-5 w-5 text-gray-500' />
                    <p className='font-semibold text-sm text-gray-700'>
                      Violations ({v.violations.length}):
                    </p>
                  </div>
                  {v.violations.map((violation, j) => (
                    <div
                      key={j}
                      className='mb-3 bg-white p-3 rounded border-2 border-gray-300 transition-colors last:mb-0'
                    >
                      <p className='text-sm text-gray-600'>{violation.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// const ConstraintCard: React.FC<ConstraintCardProps> = ({ constraint }) => {
//   const cardClass = 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300';

//   const isEditable = constraint.flexibility === 'flexible' || constraint.flexibility === 'faux-fixed';

//   return (
//     <div
//       className={`p-3 rounded-md shadow-sm border ${cardClass} transition-colors hover:shadow-md cursor-default`}
//     >
//       <div className='flex items-start'>
//         <div className="flex-1">
//           {/* Constraint title/description */}
//           <p className="font-medium text-sm text-gray-800 mb-1">
//             {constraint.description}
//           </p>

//           <div className="flex items-center gap-2 mb-2">
//             <div className="relative group">
//               <Badge
//                 variant="outline"
//                 className={isEditable
//                   ? 'text-xs bg-blue-100 text-blue-700 border-blue-200 cursor-pointer'
//                   : 'text-xs bg-gray-100 text-gray-700 border-gray-200 cursor-pointer'
//                 }
//               >
//                 {isEditable ? 'Variable' : 'Fixed'}
//               </Badge>
//               <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1">
//                 {isEditable
//                   ? "This constraint has some flexibility in interpretation"
//                   : "This constraint cannot be changed"}
//               </div>
//             </div>

//             {/* Function Badge with Tooltip */}
//             {constraint.function && (
//               <div className="relative group">
//                 <Badge
//                   variant="outline"
//                   className={`text-xs ${
//                     constraint.function === 'exclusionary'
//                       ? 'bg-red-50 text-red-700 border-red-200 cursor-pointer'
//                       : 'bg-green-50 text-green-700 border-green-200 cursor-pointer'
//                   }`}
//                 >
//                   {constraint.function === 'exclusionary' ? 'Exclusionary' : 'Focusing'}
//                 </Badge>
//                 <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1">
//                   {constraint.function === 'exclusionary'
//                     ? "Rules about what NOT to do in the story"
//                     : "Rules about what MUST be included"}
//                 </div>
//               </div>
//             )}

//             {/* Type Badge with Tooltip */}
//             {constraint.type && (
//               <div className="relative group">
//                 <Badge
//                   variant="outline"
//                   className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200 cursor-pointer"
//                 >
//                   {constraint.type}
//                 </Badge>
//                 <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1">
//                   {constraint.type === 'channel'
//                     ? "Broad constraints about setting or time period"
//                     : "Specific elements like characters or objects"}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Constraint reason */}
//           <p className='text-xs text-gray-600'>
//             {constraint.reason}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

export default ConstraintsPanel;
