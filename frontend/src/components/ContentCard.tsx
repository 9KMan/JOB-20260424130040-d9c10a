import { ContentPiece } from '@/types';
import { formatDate, getPlatformIcon } from '@/lib/utils';
import { Video, FileText, Image, Article, Clock, CheckCircle, Archive } from 'lucide-react';

interface ContentCardProps {
  piece: ContentPiece;
}

const typeIcons = {
  video: Video,
  post: FileText,
  story: Image,
  article: Article,
};

const statusStyles = {
  draft: 'badge-warning',
  scheduled: 'badge-primary',
  published: 'badge-success',
  archived: 'bg-muted/20 text-muted',
};

export default function ContentCard({ piece }: ContentCardProps) {
  const TypeIcon = typeIcons[piece.content_type] || FileText;
  const variantCount = piece.generated_content?.variants?.length || 0;

  return (
    <div className="card hover:border-primary/30 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TypeIcon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-sm line-clamp-1">{piece.title}</h3>
            <p className="text-xs text-muted mt-0.5">{formatDate(piece.created_at)}</p>
          </div>
        </div>
        <span className={`badge ${statusStyles[piece.status]}`}>
          {piece.status}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-muted">{variantCount} variant{variantCount !== 1 ? 's' : ''}</span>
        <span className="text-muted">•</span>
        <div className="flex gap-1">
          {piece.platforms.slice(0, 3).map((platform) => (
            <span key={platform} className="text-xs" title={platform}>
              {getPlatformIcon(platform)}
            </span>
          ))}
        </div>
      </div>

      {piece.scheduled_for && (
        <div className="flex items-center gap-2 text-xs text-warning mb-3">
          <Clock className="w-3 h-3" />
          {formatDate(piece.scheduled_for)}
        </div>
      )}

      {piece.performance_score !== null && piece.performance_score !== undefined && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted">Performance:</span>
          <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-success rounded-full"
              style={{ width: `${piece.performance_score}%` }}
            />
          </div>
          <span className="text-success">{piece.performance_score}%</span>
        </div>
      )}

      <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="flex-1 py-1.5 text-xs bg-surface hover:bg-primary/10 border border-border rounded-lg transition-colors">
          View
        </button>
        <button className="flex-1 py-1.5 text-xs bg-surface hover:bg-primary/10 border border-border rounded-lg transition-colors">
          Edit
        </button>
      </div>
    </div>
  );
}