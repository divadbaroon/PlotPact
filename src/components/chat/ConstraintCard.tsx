import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import type { ConstraintCardProps } from '@/types';
import DeleteConstraintDialog from './DeleteConstraintDialog';

const ConstraintCard: React.FC<ConstraintCardProps> = ({ 
  constraint,
  isNew = false,
  onDeleteConstraint
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  
  const cardClass = 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300';

  return (
    <>
      <div
        className={`p-3 rounded-md shadow-sm border ${isNew ? 'bg-green-50 border-green-200' : cardClass} transition-colors hover:shadow-md cursor-default`}
      >
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            {/* Constraint title/description */}
            <p className='font-medium text-sm text-gray-800 mb-1'>
              {constraint.description}
            </p>

            <div className='flex items-center gap-2 mb-2'>
              <div className='relative group'>
                <Badge
                  variant='outline'
                  className={
                    constraint.flexibility === 'flexible'
                      ? 'text-xs bg-blue-100 text-blue-700 border-blue-200 cursor-pointer'
                      : 'text-xs bg-gray-100 text-gray-700 border-gray-200 cursor-pointer'
                  }
                >
                  {constraint.flexibility === 'flexible' ? 'Flexible' : 'Fixed'}
                </Badge>
                <div className='absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1'>
                  {constraint.flexibility === 'flexible'
                    ? 'This constraint has some flexibility in interpretation'
                    : 'This constraint has rigid requirements that must be followed'}
                </div>
              </div>

              {/* Function Badge with Tooltip */}
              {constraint.function && (
                <div className='relative group'>
                  <Badge
                    variant='outline'
                    className={`text-xs ${
                      constraint.function === 'exclusionary'
                        ? 'bg-red-50 text-red-700 border-red-200 cursor-pointer'
                        : 'bg-green-50 text-green-700 border-green-200 cursor-pointer'
                    }`}
                  >
                    {constraint.function === 'exclusionary'
                      ? 'Exclusionary'
                      : 'Focusing'}
                  </Badge>
                  <div className='absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1'>
                    {constraint.function === 'exclusionary'
                      ? 'Rules about what NOT to do in the story'
                      : 'Rules about what MUST be included'}
                  </div>
                </div>
              )}

              {/* Type Badge with Tooltip */}
              {constraint.type && (
                <div className='relative group'>
                  <Badge
                    variant='outline'
                    className='text-xs bg-indigo-50 text-indigo-700 border-indigo-200 cursor-pointer'
                  >
                    {constraint.type}
                  </Badge>
                  <div className='absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg top-full left-0 mt-1'>
                    {constraint.type === 'channel'
                      ? 'Broad constraints about setting or time period'
                      : 'Specific elements like characters or objects'}
                  </div>
                </div>
              )}
            </div>

            {/* Constraint reason */}
            <p className='text-xs text-gray-600'>{constraint.reason}</p>
          </div>
          
          {/* Delete button */}
          <button 
            className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
            onClick={() => setDeleteDialogOpen(true)}
            title="Delete constraint"
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      <DeleteConstraintDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        constraint={constraint}
        onConfirmDelete={onDeleteConstraint || (() => {})}
      />
    </>
  );
};

export default ConstraintCard;