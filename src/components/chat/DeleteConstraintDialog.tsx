import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, AlertCircle } from 'lucide-react';
import type { DeleteConstraintDialogProps } from '@/types';

const DeleteConstraintDialog: React.FC<DeleteConstraintDialogProps> = ({
  open,
  setOpen,
  constraint,
  onConfirmDelete,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Confirm Constraint Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this constraint?
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4 border rounded-md bg-gray-50 my-4">
          <p className="font-medium text-sm">{constraint.description}</p>
          <p className="text-xs text-gray-600 mt-1">{constraint.reason}</p>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirmDelete(constraint);
              setOpen(false);
            }}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Constraint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConstraintDialog;