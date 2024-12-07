import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, MessageSquareMore, Pencil, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export interface ICommentProps {
  children?: React.ReactNode;
  comment: string | null;
  handleRemoveComment?: () => void;
  handleSaveComment?: (comment: string) => void;
  title?: string;
  placeholder?: string;
  buttonText?: string;
  readonly?: boolean;
}

const Comment = ({
  children,
  comment,
  handleRemoveComment,
  handleSaveComment,
  title = 'Comentario',
  placeholder = 'Descripción del comentario',
  buttonText = 'COMENTARIO',
  readonly,
}: ICommentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [comentario, setComentario] = useState<string | null>(comment);

  const handleSave = () => {
    handleSaveComment && handleSaveComment(comentario as string);
    setIsOpen(false);
    setComentario(null);
  };

  const handleDelete = () => {
    handleRemoveComment && handleRemoveComment();
    setIsOpen(false);
    setComentario(null);
  };

  const handleClose = (isOpen: boolean) => {
    setIsOpen(isOpen);
    setIsEditing(false);
  };

  useEffect(() => {
    setComentario(comment);
  }, [comment]);

  return (
    <Popover open={isOpen} onOpenChange={handleClose}>
      <PopoverTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline">
            {!comment ? (
              <MessageSquare className="w-4 h-4" />
            ) : (
              <MessageSquareMore className="w-4 h-4" />
            )}
            {buttonText}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent side="top" className="w-80">
        <div className="space-y-4 font-onest">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 font-semibold rounded-full bg-primary text-primary-foreground">
              A
            </div>
            <h4 className="font-medium leading-none">{title}</h4>
            {comment && !isEditing && !readonly && (
              <div className="ml-auto space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-auto"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-auto"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          {(!readonly && !comment) || (!readonly && isEditing) ? (
            <Textarea
              placeholder={placeholder}
              value={comentario ?? ''}
              onChange={(e) => setComentario(e.target.value)}
              className="min-h-[100px]"
            />
          ) : (
            <p className="pl-1 text-sm text-muted-foreground">
              {comment || placeholder}
            </p>
          )}
          {(!readonly && !comment) || (!readonly && isEditing) ? (
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleClose(false)}
              >
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave}>
                Guardar
              </Button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Comment;
