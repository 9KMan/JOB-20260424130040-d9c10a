'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AnalyticsOverview, PlatformStats } from '@/types';
import { formatNumber } from '@/lib/utils';
import { TrendingUp, Eye, Heart, Share2, BarChart3, PieChart } from 'lucide-react';
import StatsCard from '@/components/StatsCard';

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [platforms, setPlatforms] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.analytics.overview(), api.analytics.platforms()])
      .then(([overviewData, platformsData]) => {
        setOverview(overviewData);
        setPlatforms(platformsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-surface rounded animate-pulse"></div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-surface rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Views',
      value: formatNumber(overview?.total_views || 0),
      icon: Eye,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Total Likes',
      value: formatNumber(overview?.total_likes || 0),
      icon: Heart,
      color: 'text-pink-400',
      bgColor: 'bg-pink-400/10',
    },
    {
      label: 'Total Shares',
      value: formatNumber(overview?.total_shares || 0),
      icon: Share2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      label: 'Avg Performance',
      value: `${overview?.average_performance_score || 0}%`,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-text-secondary mt-1">Track your content performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>

      {overview?.ai_insights && (
        <div className="card border-l-4 border-accent">
          <div className="flex items-start gap-3">
            <BarChart3 className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h3 className="font-semibold text-accent mb-1">AI Performance Insights</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{overview.ai_insights}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" />
            Content Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
              <span className="text-text-secondary">Total Pieces</span>
              <span className="font-mono font-medium">{overview?.total_content_pieces || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
              <span className="text-text-secondary">Published</span>
              <span className="font-mono font-medium text-success">{overview?.published || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
              <span className="text-text-secondary">Scheduled</span>
              <span className="font-mono font-medium text-warning">{overview?.scheduled || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
              <span className="text-text-secondary">Drafts</span>
              <span className="font-mono font-medium text-muted">{overview?.drafts || 0}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Platform Breakdown
          </h3>
          <div className="space-y-4">
            {platforms?.platforms ? (
              Object.entries(platforms.platforms).map(([platform, data]) => (
                <div key={platform} className="p-3 rounded-lg bg-surface/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{platform}</span>
                    <span className="text-sm text-text-secondary">
                      {data.published}/{data.total_posts} posts
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-accent">{formatNumber(data.total_views)} views</span>
                    <span className="text-pink-400">{formatNumber(data.total_likes)} likes</span>
                    <span className="text-blue-400">{formatNumber(data.total_shares)} shares</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-text-secondary text-sm">No platform data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}