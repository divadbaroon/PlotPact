import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollText } from 'lucide-react';

interface StoryPlotDisplayProps {
  plot: string;
}

const StoryPlotDisplay: React.FC<StoryPlotDisplayProps> = ({ plot }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className='relative mt-4 mb-4'>
      <div className='flex justify-end mb-2'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setIsExpanded(!isExpanded)}
          className='hover:bg-gray-100 transition-colors'
        >
          {isExpanded ? 'Hide Plot' : 'Show Plot'}
        </Button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <Card className='bg-gray-50 border border-gray-200'>
          <CardContent className='pt-6 -mt-6'>
            <div className='flex items-center gap-2 mb-3'>
              <ScrollText className='h-5 w-5 text-indigo-600' />
              <h2 className='text-lg font-semibold text-gray-800'>
                Story Plot
              </h2>
            </div>
            <p className='text-gray-700 bg-white p-4 rounded-md border border-gray-200 italic'>
              {plot}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoryPlotDisplay;
