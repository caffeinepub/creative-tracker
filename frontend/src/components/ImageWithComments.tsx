import { useState, useRef, useCallback, useEffect } from 'react';
import { X, MessageCircle, Loader2 } from 'lucide-react';
import type { PositionalComment } from '../backend';
import { cn } from '@/lib/utils';

interface PendingComment {
  xPercentage: number;
  yPercentage: number;
}

interface ImageWithCommentsProps {
  imageUrl: string;
  imageAlt: string;
  comments: PositionalComment[];
  onAddComment: (text: string, xPercentage: number, yPercentage: number) => Promise<void>;
  onDeleteComment: (commentId: bigint) => Promise<void>;
  isAddingComment?: boolean;
  isDeletingCommentId?: bigint | null;
}

export function ImageWithComments({
  imageUrl,
  imageAlt,
  comments,
  onAddComment,
  onDeleteComment,
  isAddingComment = false,
  isDeletingCommentId = null,
}: ImageWithCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [pending, setPending] = useState<PendingComment | null>(null);
  const [commentText, setCommentText] = useState('');
  const [hoveredCommentId, setHoveredCommentId] = useState<bigint | null>(null);

  // Focus input when pending comment appears
  useEffect(() => {
    if (pending && inputRef.current) {
      inputRef.current.focus();
    }
  }, [pending]);

  // Escape key cancels pending input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPending(null);
        setCommentText('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleImageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Don't open new comment if clicking on an existing pin or its popover
      const target = e.target as HTMLElement;
      if (target.closest('[data-comment-pin]') || target.closest('[data-comment-form]')) return;
      if (isAddingComment) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const xPercentage = ((e.clientX - rect.left) / rect.width) * 100;
      const yPercentage = ((e.clientY - rect.top) / rect.height) * 100;

      setPending({ xPercentage, yPercentage });
      setCommentText('');
    },
    [isAddingComment]
  );

  const handleSubmit = async () => {
    if (!pending || !commentText.trim() || isAddingComment) return;
    try {
      await onAddComment(commentText.trim(), pending.xPercentage, pending.yPercentage);
      setPending(null);
      setCommentText('');
    } catch {
      // error handled by parent
    }
  };

  const handleCancel = () => {
    setPending(null);
    setCommentText('');
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Clamp position so the pin/form doesn't overflow the container
  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

  return (
    <div
      ref={containerRef}
      className="relative select-none cursor-crosshair"
      onClick={handleImageClick}
    >
      <img
        src={imageUrl}
        alt={imageAlt}
        className="w-full h-auto block pointer-events-none"
        draggable={false}
      />

      {/* Existing comment pins */}
      {comments.map((comment) => {
        const isHovered = hoveredCommentId === comment.id;
        const isDeleting = isDeletingCommentId === comment.id;
        const left = clamp(comment.xPercentage, 1, 97);
        const top = clamp(comment.yPercentage, 1, 97);

        // Determine if popover should open to the left to avoid overflow
        const openLeft = left > 60;
        const openUp = top > 65;

        return (
          <div
            key={String(comment.id)}
            data-comment-pin
            className="absolute z-10"
            style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%, -50%)' }}
            onMouseEnter={() => setHoveredCommentId(comment.id)}
            onMouseLeave={() => setHoveredCommentId(null)}
          >
            {/* Pin marker */}
            <div
              className={cn(
                'relative flex items-center justify-center rounded-full border-2 transition-all duration-200 cursor-pointer',
                isHovered
                  ? 'w-7 h-7 bg-primary border-primary-foreground shadow-lg'
                  : 'w-5 h-5 bg-primary/70 border-primary-foreground/80 shadow-md'
              )}
            >
              {isDeleting ? (
                <Loader2 className="w-3 h-3 text-primary-foreground animate-spin" />
              ) : (
                <MessageCircle
                  className={cn(
                    'text-primary-foreground transition-all duration-200',
                    isHovered ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5'
                  )}
                />
              )}
            </div>

            {/* Subtle text preview when not hovered */}
            {!isHovered && (
              <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-[10px] font-medium text-primary/60 bg-background/60 backdrop-blur-sm px-1 rounded whitespace-nowrap max-w-[80px] truncate block leading-tight">
                  {comment.text}
                </span>
              </div>
            )}

            {/* Expanded popover on hover */}
            {isHovered && (
              <div
                data-comment-pin
                className={cn(
                  'absolute z-20 w-56 bg-card border border-border rounded-lg shadow-xl p-3',
                  openLeft ? 'right-8' : 'left-8',
                  openUp ? 'bottom-0' : 'top-0'
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-card-foreground leading-snug flex-1 break-words">
                    {comment.text}
                  </p>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!isDeleting) {
                        await onDeleteComment(comment.id);
                      }
                    }}
                    disabled={isDeleting}
                    className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete comment"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <X className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  {new Date(Number(comment.timestamp) / 1_000_000).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Pending new comment input */}
      {pending && (
        <div
          data-comment-form
          className="absolute z-30"
          style={{
            left: `${clamp(pending.xPercentage, 2, 70)}%`,
            top: `${clamp(pending.yPercentage, 2, 80)}%`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drop pin indicator */}
          <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-accent border-2 border-accent-foreground/60 shadow-lg flex items-center justify-center pointer-events-none">
            <MessageCircle className="w-3 h-3 text-accent-foreground" />
          </div>

          <div className="ml-4 bg-card border border-border rounded-lg shadow-2xl p-3 w-56">
            <textarea
              ref={inputRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDownInput}
              placeholder="Add a comment… (Enter to submit)"
              rows={3}
              className="w-full text-sm bg-transparent text-card-foreground placeholder:text-muted-foreground resize-none outline-none border-none focus:ring-0 leading-snug"
            />
            <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-border">
              <button
                onClick={handleCancel}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!commentText.trim() || isAddingComment}
                className={cn(
                  'text-xs font-medium px-3 py-1 rounded transition-colors flex items-center gap-1',
                  commentText.trim() && !isAddingComment
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
              >
                {isAddingComment && <Loader2 className="w-3 h-3 animate-spin" />}
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hint overlay when no comments */}
      {comments.length === 0 && !pending && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
          <span className="text-[11px] text-white/70 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
            Click anywhere on the image to add a comment
          </span>
        </div>
      )}
    </div>
  );
}
