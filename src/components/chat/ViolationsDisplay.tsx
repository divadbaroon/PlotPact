import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import type { Violation } from '@/types';

interface ViolationsDisplayProps {
  violations: Violation[];
}

const ViolationsDisplay: React.FC<ViolationsDisplayProps> = ({ violations }) => {
  if (violations.length === 0) return null;

  return (
    <Card className='bg-red-100 border-2 border-red-300 mb-6 animate-in fade-in duration-300 shadow-md hover:shadow-lg hover:border-red-400 transition-all cursor-help'>
      <CardContent className='pt-6'>
        <div className='flex items-center gap-2 mb-4 text-red-800'>
          <AlertCircle className='h-6 w-6 text-red-600' />
          <h3 className='text-lg font-bold'>Story Inconsistencies Found</h3>
        </div>
        <div className='space-y-3'>
          {violations.map((violation, index) => (
            <div
              key={index}
              className='border-l-4 border-red-500 pl-4 py-2 bg-white rounded-md shadow-sm hover:shadow-md hover:bg-red-50 transition-all duration-200'
            >
              <p className='text-red-700 font-semibold text-sm mb-1'>
                {violation.constraintType}
              </p>
              <p className='text-gray-800 text-sm'>{violation.explanation}</p>
            </div>
          ))}
        </div>
        <div className='flex items-center gap-2 mt-5 p-3 bg-red-50 border border-red-200 rounded-md'>
          <AlertCircle className='h-5 w-5 text-red-500 flex-shrink-0' />
          <p className='text-sm text-gray-700'>
            Please revise your input to maintain story consistency.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(ViolationsDisplay);
