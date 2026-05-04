'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AnalyticsOverview } from '@/types';
import { formatNumber } from '@/lib/utils';
import { TrendingUp, Video, FileText, Clock, Eye, Heart, Share2, Zap } from 'lucide-react';
import StatsCard from '@/components/StatsCard';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.analytics.overview()
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-surface rounded"></div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-surface rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Content',
      value: analytics?.total_content_pieces || 0,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Published',
      value: analytics?.published || 0,
      icon: Video,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Scheduled',
      value: analytics?.scheduled || 0,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Total Views',
      value: formatNumber(analytics?.total_views || 0),
      icon: Eye,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  const engagementStats = [
    {
      label: 'Likes',
      value: formatNumber(analytics?.total_likes || 0),
      icon: Heart,
      color: 'text-pink-400',
    },
    {
      label: 'Shares',
      value: formatNumber(analytics?.total_shares || 0),
      icon: Share2,
      color: 'text-blue-400',
    },
    {
      label: 'Avg Performance',
      value: `${analytics?.average_performance_score || 0}%`,
      icon: TrendingUp,
      color: 'text-purple-400',
    },
    {
      label: 'Drafts',
      value: analytics?.drafts || 0,
      icon: Zap,
      color: 'text-muted',
    },
  ];

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-text-secondary mt-1">Your content at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {engagementStats.map((stat) => (
          <div key={stat.label} className="card flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.color.replace('text-', 'bg-')}/10`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-text-secondary">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {analytics?.ai_insights && (
        <div className="card border-l-4 border-accent">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h3 className="font-semibold text-accent mb-1">AI Insights</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{analytics.ai_insights}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/content/generate" className="block p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
              <p className="font-medium text-primary">Generate New Content</p>
              <p className="text-sm text-text-secondary">Create AI-powered content variants</p>
            </a>
            <a href="/trends" className="block p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors">
              <p className="font-medium text-accent">View Trends</p>
              <p className="text-sm text-text-secondary">Discover trending topics</p>
            </a>
            <a href="/instructions" className="block p-4 rounded-lg bg-success/10 hover:bg-success/20 transition-colors">
              <p className="font-medium text-success">Check Instructions</p>
              <p className="text-sm text-text-secondary">See your daily content tasks</p>
            </a>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Content Pipeline</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-draft"></div>
                <span className="text-sm">Drafts</span>
              </div>
              <span className="font-mono text-sm">{analytics?.drafts || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                <span className="text-sm">Scheduled</span>
              </div>
              <span className="font-mono text-sm">{analytics?.scheduled || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-sm">Published</span>
              </div>
              <span className="font-mono text-sm">{analytics?.published || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}