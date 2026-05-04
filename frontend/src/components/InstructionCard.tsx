import { CreatorInstruction } from '@/types';
import { formatDate, getUrgencyColor } from '@/lib/utils';
import { CheckCircle, XCircle, Eye, Clock, Video, FileText, Image, Article } from 'lucide-react';

interface InstructionCardProps {
  instruction: CreatorInstruction;
  onMarkRead: (id: string) => void;
  onMarkDone: (id: string) => void;
}

const typeIcons = {
  video: Video,
  post: FileText,
  story: Image,
  article: Article,
};

export default function InstructionCard({
  instruction,
  onMarkRead,
  onMarkDone,
}: InstructionCardProps) {
  const TypeIcon = instruction.content_type
    ? typeIcons[instruction.content_type as keyof typeof typeIcons] || FileText
    : FileText;

  return (
    <div
      className={`card transition-all ${
        !instruction.read ? 'border-l-4 border-l-accent' : 'opacity-75'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-surface">
          <TypeIcon className="w-5 h-5 text-accent" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`badge ${getUrgencyColor(instruction.urgency)}`}>
              {instruction.urgency}
            </span>
            {!instruction.read && (
              <span className="badge badge-accent">New</span>
            )}
            <span className="text-xs text-muted">
              {formatDate(instruction.created_at)}
            </span>
          </div>

          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {instruction.instruction_text}
          </p>

          <div className="mt-4 flex gap-2">
            {!instruction.read && (
              <button
                onClick={() => onMarkRead(instruction.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-surface hover:bg-primary/10 border border-border rounded-lg transition-colors"
              >
                <Eye className="w-3 h-3" />
                Mark Read
              </button>
            )}
            <button
              onClick={() => onMarkDone(instruction.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-success/10 hover:bg-success/20 text-success border border-success/20 rounded-lg transition-colors"
            >
              <CheckCircle className="w-3 h-3" />
              Done
            </button>
            <button
              onClick={() => onMarkDone(instruction.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-surface hover:bg-red-500/10 text-red-400 border border-border rounded-lg transition-colors"
            >
              <XCircle className="w-3 h-3" />
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}