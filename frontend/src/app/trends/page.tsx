'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Trend } from '@/types';
import { formatNumber } from '@/lib/utils';
import { TrendingUp, RefreshCw, Filter } from 'lucide-react';
import TrendCard from '@/components/TrendCard';

const PLATFORMS = ['all', 'youtube', 'tiktok', 'instagram', 'twitter'];

export default function TrendsPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    try {
      const data = await api.trends.list(filter === 'all' ? undefined : filter);
      setTrends(data);
    } catch (error) {
      console.error('Failed to load trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await api.trends.refresh();
      setTrends(data.trends);
    } catch (error) {
      console.error('Failed to refresh trends:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setLoading(true);
    loadTrends();
  };

  const topTrends = trends.slice(0, 5);
  const restTrends = trends.slice(5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trend Scanner</h1>
          <p className="text-text-secondary mt-1">Discover trending topics across platforms</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {PLATFORMS.map((platform) => (
          <button
            key={platform}
            onClick={() => handleFilterChange(platform)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === platform
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:text-text'
            }`}
          >
            {platform === 'all' ? 'All Platforms' : platform.charAt(0).toUpperCase() + platform.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 w-3/4 bg-surface rounded mb-3"></div>
              <div className="h-3 w-1/2 bg-surface rounded"></div>
            </div>
          ))}
        </div>
      ) : trends.length === 0 ? (
        <div className="card text-center py-12">
          <TrendingUp className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-text-secondary">No trends found</p>
          <button onClick={handleRefresh} className="btn-primary mt-4">
            Refresh Trends
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topTrends.map((trend, index) => (
              <TrendCard key={trend.id} trend={trend} rank={index + 1} featured />
            ))}
          </div>

          {restTrends.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {restTrends.map((trend, index) => (
                <TrendCard key={trend.id} trend={trend} rank={index + 6} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}