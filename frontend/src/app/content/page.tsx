'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ContentPiece } from '@/types';
import { formatDate } from '@/lib/utils';
import ContentCard from '@/components/ContentCard';
import Link from 'next/link';

export default function ContentPage() {
  const [content, setContent] = useState<ContentPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const data = await api.content.list();
      setContent(data);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = content.filter((piece) => {
    if (filter === 'all') return piece.status !== 'archived';
    return piece.status === filter;
  });

  const statusCounts = {
    all: content.filter((p) => p.status !== 'archived').length,
    draft: content.filter((p) => p.status === 'draft').length,
    scheduled: content.filter((p) => p.status === 'scheduled').length,
    published: content.filter((p) => p.status === 'published').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Pieces</h1>
          <p className="text-text-secondary mt-1">Manage your generated content</p>
        </div>
        <Link href="/content/generate" className="btn-primary">
          Generate Content
        </Link>
      </div>

      <div className="flex gap-2">
        {(['all', 'draft', 'scheduled', 'published'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:text-text'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 w-3/4 bg-surface rounded mb-3"></div>
              <div className="h-3 w-1/2 bg-surface rounded mb-4"></div>
              <div className="h-20 bg-surface rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredContent.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-text-secondary mb-4">No content pieces found</p>
          <Link href="/content/generate" className="btn-primary">
            Generate Your First Content
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContent.map((piece) => (
            <ContentCard key={piece.id} piece={piece} />
          ))}
        </div>
      )}
    </div>
  );
}