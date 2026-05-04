import { Trend } from '@/types';
import { formatNumber, getPlatformIcon } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendCardProps {
  trend: Trend;
  rank: number;
  featured?: boolean;
}

const velocityIcons = {
  rising: TrendingUp,
  stable: Minus,
  declining: TrendingDown,
};

const velocityColors = {
  rising: 'text-success',
  stable: 'text-warning',
  declining: 'text-red-400',
};

export default function TrendCard({ trend, rank, featured }: TrendCardProps) {
  const VelocityIcon = velocityIcons[trend.velocity] || Minus;

  return (
    <div
      className={`card hover:border-accent/30 transition-all ${
        featured ? 'border-accent/20' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {featured && (
            <span className="text-lg font-bold text-accent">#{rank}</span>
          )}
          <span className="text-lg" title={trend.platform}>
            {getPlatformIcon(trend.platform)}
          </span>
        </div>
        <div className={`flex items-center gap-1 text-xs ${velocityColors[trend.velocity]}`}>
          <VelocityIcon className="w-3 h-3" />
          {trend.velocity}
        </div>
      </div>

      <h3 className={`font-medium line-clamp-2 ${featured ? 'text-lg' : ''}`}>
        {trend.topic}
      </h3>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted">Volume Score</p>
          <p className="text-lg font-mono font-bold text-accent">
            {formatNumber(trend.volume_score)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted capitalize">{trend.platform}</p>
          <p className="text-xs text-text-secondary">
            {new Date(trend.captured_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {featured && (
        <button className="w-full mt-4 py-2 text-sm bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors">
          Generate Content
        </button>
      )}
    </div>
  );
}