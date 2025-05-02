'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, ScrollText, CheckCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import React from 'react';

interface CreateCustomPlotProps {
  title: string;
  setTitle: (title: string) => void;
  plot: string;
  setPlot: (plot: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const CreateCustomPlot: React.FC<CreateCustomPlotProps> = ({
  title,
  setTitle,
  plot,
  setPlot,
  open,
  setOpen,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <Dialog open={open}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Create Your Story</DialogTitle>
          <DialogDescription>
            Provide a title and describe the setting, characters, and central
            conflict of your story. This will be used to generate initial
            constraints.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4 space-y-6'>
          {/* Story Title */}
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <ScrollText className='h-5 w-5 text-primary' />
              <h3 className='text-sm font-medium'>Story Title</h3>
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Give your story a title'
              className='mb-1'
            />
            <p className='text-xs text-muted-foreground'>
              Keep it short and engaging. This will appear as your story
              headline.
            </p>
          </div>

          {/* Story Plot */}
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <ScrollText className='h-5 w-5 text-primary' />
              <h3 className='text-sm font-medium'>Story Plot</h3>
            </div>

            <Textarea
              value={plot}
              onChange={(e) => setPlot(e.target.value)}
              placeholder='Describe your story plot here...'
              className='min-h-[150px] mb-2'
            />
            <p className='text-xs text-muted-foreground'>
              Minimum 50 characters. More detailed plots will generate better
              constraints.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || plot.length < 50 || title.trim() === ''}
            className='gap-2'
          >
            {isSubmitting ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle className='h-4 w-4' />
                Create Story
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCustomPlot;
